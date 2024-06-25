import { Ctx } from "@common/ctx";
import { err } from "@common/result";
import {
  Course,
  CourseDetails,
  courseSchema,
  Lesson,
  lessonContentSchema,
  LessonDetails,
  LessonPreview,
  lessonSchema,
} from "@course/domain";
import {
  CourseNotFoundError,
  LessonNotFoundError,
  Result,
  UnexpectedError,
} from "@course/error";
import { CourseStore } from "@course/ports";
import { db } from "@postgres";
import { ok } from "@common/result";
import { Unit, unit } from "@common/unit";

export class PostgresCourseStore implements CourseStore {
  async createCourse(
    _ctx: Ctx,
    courseDetails: CourseDetails,
    courseId: string
  ): Promise<Result<Course>> {
    try {
      await db
        .insertInto("course")
        .values({
          course_id: courseId,
          title: courseDetails.title,
          description: courseDetails.description,
          syllabus: courseDetails.syllabus,
          instructor_name: courseDetails.instructorName,
        })
        .execute();
      return ok(
        courseSchema.parse({
          courseId,
          details: courseDetails,
          lessonCount: 0,
        })
      );
    } catch (error: any) {
      console.error("[PostgresCourseStore.createCourse]", error);
      return err(new UnexpectedError(error));
    }
  }

  async getCourse(_ctx: Ctx, courseId: string): Promise<Result<Course>> {
    try {
      const course = await db
        .selectFrom("course")
        .leftJoin("lesson", "course.course_id", "lesson.course_id")
        .select(({ fn, ref }) => [
          "course.course_id",
          "course.title",
          "course.description",
          "course.syllabus",
          "course.instructor_name",
          fn.count(ref("lesson.lesson_id")).as("lesson_count"),
        ])
        .where("course.course_id", "=", courseId)
        .groupBy("course.course_id")
        .executeTakeFirst();
      if (!course) {
        return err(new CourseNotFoundError(courseId));
      }
      return ok(
        courseSchema.parse({
          courseId: course.course_id,
          details: {
            title: course.title,
            description: course.description,
            syllabus: course.syllabus,
            instructorName: course.instructor_name,
          },
          lessonCount: course.lesson_count,
        })
      );
    } catch (error: any) {
      console.error("[PostgresCourseStore.getCourse]", error);
      return err(new UnexpectedError(error));
    }
  }

  async listCourses(_ctx: Ctx): Promise<Result<Course[]>> {
    try {
      const courses = await db
        .selectFrom("course")
        .leftJoin("lesson", "course.course_id", "lesson.course_id")
        .select(({ fn, ref }) => [
          "course.course_id",
          "course.title",
          "course.description",
          "course.syllabus",
          "course.instructor_name",
          fn.count(ref("lesson.lesson_id")).as("lesson_count"),
        ])
        .groupBy("course.course_id")
        .execute();
      return ok(
        courses.map((course) =>
          courseSchema.parse({
            courseId: course.course_id,
            details: {
              title: course.title,
              description: course.description,
              syllabus: course.syllabus,
              instructorName: course.instructor_name,
            },
            lessonCount: course.lesson_count,
          })
        )
      );
    } catch (error: any) {
      console.error("[PostgresCourseStore.listCourses]", error);
      return err(new UnexpectedError(error));
    }
  }

  async updateCourse(
    _ctx: Ctx,
    courseId: string,
    courseDetails: CourseDetails
  ): Promise<Result<Course>> {
    try {
      const updateResult = await db
        .updateTable("course")
        .set({
          title: courseDetails.title,
          description: courseDetails.description,
          syllabus: courseDetails.syllabus,
          instructor_name: courseDetails.instructorName,
        })
        .where("course_id", "=", courseId)
        .executeTakeFirst();
      if (!updateResult.numUpdatedRows) {
        return err(new CourseNotFoundError(courseId));
      }
      return this.getCourse(_ctx, courseId);
    } catch (error: any) {
      console.error("[PostgresCourseStore.updateCourse]", error);
      return err(new UnexpectedError(error));
    }
  }

  async deleteCourse(_ctx: Ctx, courseId: string): Promise<Result<Unit>> {
    try {
      const deleteResult = await db
        .deleteFrom("course")
        .where("course_id", "=", courseId)
        .executeTakeFirst();
      if (!deleteResult.numDeletedRows) {
        return err(new CourseNotFoundError(courseId));
      }
      return ok(unit());
    } catch (error: any) {
      console.error("[PostgresCourseStore.deleteCourse]", error);
      return err(new UnexpectedError(error));
    }
  }

  async createLesson(
    _ctx: Ctx,
    courseId: string,
    lessonId: string,
    lessonDetails: LessonDetails
  ): Promise<Result<Lesson>> {
    try {
      const row = await db
        .insertInto("lesson")
        .values({
          lesson_id: lessonId,
          course_id: courseId,
          title: lessonDetails.title,
          content: lessonDetails.content,
        })
        .returning(["created_at"])
        .executeTakeFirst();
      if (!row) {
        return err(new UnexpectedError("Failed to create lesson"));
      }
      return ok(
        lessonSchema.parse({
          lessonId,
          details: lessonDetails,
          createdAt: row.created_at,
        })
      );
    } catch (error: any) {
      console.error("[PostgresCourseStore.createLesson]", error);
      return err(new UnexpectedError(error));
    }
  }

  async getLesson(
    _ctx: Ctx,
    courseId: string,
    lessonId: string
  ): Promise<Result<Lesson>> {
    try {
      const lesson = await db
        .selectFrom("lesson")
        .select(["title", "content", "created_at"])
        .where("course_id", "=", courseId)
        .where("lesson_id", "=", lessonId)
        .executeTakeFirst();
      if (!lesson) {
        return err(new CourseNotFoundError(courseId));
      }
      return ok(
        lessonSchema.parse({
          lessonId,
          details: {
            title: lesson.title,
            content: lesson.content,
          },
          createdAt: lesson.created_at,
        })
      );
    } catch (error: any) {
      console.error("[PostgresCourseStore.getLesson]", error);
      return err(new UnexpectedError(error));
    }
  }

  async listLessons(
    _ctx: Ctx,
    courseId: string
  ): Promise<Result<LessonPreview[]>> {
    try {
      const lessons = await db
        .selectFrom("lesson")
        .select(["lesson_id", "title", "content", "created_at"])
        .where("course_id", "=", courseId)
        .execute();
      return ok(
        lessons.map(
          (lesson) =>
            ({
              lessonId: lesson.lesson_id,
              title: lesson.title,
              type: lessonContentSchema.parse(lesson.content).type,
              createdAt: lesson.created_at,
            }) as LessonPreview
        )
      );
    } catch (error: any) {
      console.error("[PostgresCourseStore.listLessons]", error);
      return err(new UnexpectedError(error));
    }
  }

  async updateLesson(
    _ctx: Ctx,
    courseId: string,
    lessonId: string,
    lessonDetails: LessonDetails
  ): Promise<Result<Lesson>> {
    try {
      const updateResult = await db
        .updateTable("lesson")
        .set({
          title: lessonDetails.title,
          content: lessonDetails.content,
        })
        .where("course_id", "=", courseId)
        .where("lesson_id", "=", lessonId)
        .executeTakeFirst();

      if (!updateResult.numUpdatedRows) {
        return err(new LessonNotFoundError(courseId, lessonId));
      }
      return ok(
        lessonSchema.parse({
          lessonId,
          details: lessonDetails,
        })
      );
    } catch (error: any) {
      console.error("[PostgresCourseStore.updateLesson]", error);
      return err(new UnexpectedError(error));
    }
  }

  async deleteLesson(
    _ctx: Ctx,
    courseId: string,
    lessonId: string
  ): Promise<Result<Unit>> {
    try {
      const deleteResult = await db
        .deleteFrom("lesson")
        .where("course_id", "=", courseId)
        .where("lesson_id", "=", lessonId)
        .executeTakeFirst();

      if (!deleteResult.numDeletedRows) {
        return err(new LessonNotFoundError(courseId, lessonId));
      }
      return ok(unit());
    } catch (error: any) {
      console.error("[PostgresCourseStore.deleteLesson]", error);
      return err(new UnexpectedError(error));
    }
  }
}

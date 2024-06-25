import { unit, Unit } from "@common/unit";
import {
  CourseDetails,
  Course,
  courseSchema,
  Lesson,
  LessonDetails,
  lessonSchema,
  LessonPreview,
} from "@course/domain";
import {
  CourseNotFoundError,
  LessonNotFoundError,
  Result,
} from "@course/error";
import { CourseStore } from "@course/ports";
import { err, ok } from "@common/result";
import { Ctx } from "@common/ctx";

type CourseRow = {
  courseId: string;
  courseDetails: CourseDetails;
  lessons: Lesson[];
};

export class InMemoryCourseStore implements CourseStore {
  courses: CourseRow[] = [];

  async createCourse(
    _ctx: Ctx,
    courseDetails: CourseDetails,
    courseId: string
  ): Promise<Result<Course>> {
    const course = {
      courseId,
      courseDetails,
      lessons: [] as Lesson[],
    };
    this.courses.push(course);
    return ok(
      courseSchema.parse({
        courseId,
        details: courseDetails,
        lessonCount: 0,
      })
    );
  }

  async getCourse(_ctx: Ctx, courseId: string): Promise<Result<Course>> {
    const course = this.courses.find((c) => c.courseId === courseId);
    if (!course) {
      return err(new CourseNotFoundError(courseId));
    }
    return ok(
      courseSchema.parse({
        courseId: course.courseId,
        details: course.courseDetails,
        lessonCount: course.lessons.length,
      })
    );
  }

  async listCourses(_ctx: Ctx): Promise<Result<Course[]>> {
    return ok(
      this.courses.map((course) =>
        courseSchema.parse({
          courseId: course.courseId,
          details: course.courseDetails,
          lessonCount: course.lessons.length,
        })
      )
    );
  }

  async updateCourse(
    _ctx: Ctx,
    courseId: string,
    courseDetails: CourseDetails
  ): Promise<Result<Course>> {
    const course = this.courses.find((c) => c.courseId === courseId);
    if (!course) {
      return err(new CourseNotFoundError(courseId));
    }
    course.courseDetails = courseDetails;
    return ok(
      courseSchema.parse({
        courseId: course.courseId,
        details: course.courseDetails,
        lessonCount: course.lessons.length,
      })
    );
  }

  async deleteCourse(_ctx: Ctx, courseId: string): Promise<Result<Unit>> {
    const courseIndex = this.courses.findIndex((c) => c.courseId === courseId);
    if (courseIndex === -1) {
      return err(new CourseNotFoundError(courseId));
    }
    this.courses.splice(courseIndex, 1);
    return ok(unit());
  }

  async createLesson(
    _ctx: Ctx,
    courseId: string,
    lessonId: string,
    lessonDetails: LessonDetails
  ): Promise<Result<Lesson>> {
    const course = this.courses.find((c) => c.courseId === courseId);
    if (!course) {
      return err(new CourseNotFoundError(courseId));
    }
    const lesson = {
      lessonId,
      details: lessonDetails,
      createdAt: new Date(),
    };
    course.lessons.push(lesson);
    return ok(lessonSchema.parse(lesson));
  }

  async getLesson(
    _ctx: Ctx,
    courseId: string,
    lessonId: string
  ): Promise<Result<Lesson>> {
    const course = this.courses.find((c) => c.courseId === courseId);
    if (!course) {
      return err(new CourseNotFoundError(courseId));
    }
    const lesson = course.lessons.find((l) => l.lessonId === lessonId);
    if (!lesson) {
      return err(new LessonNotFoundError(courseId, lessonId));
    }
    return ok(lessonSchema.parse(lesson));
  }

  async listLessons(
    _ctx: Ctx,
    courseId: string
  ): Promise<Result<LessonPreview[]>> {
    const course = this.courses.find((c) => c.courseId === courseId);
    if (!course) {
      return err(new CourseNotFoundError(courseId));
    }
    return ok(
      course.lessons.map(
        (lesson) =>
          ({
            lessonId: lesson.lessonId,
            title: lesson.details.title,
            type: lesson.details.content.type,
          }) as LessonPreview
      )
    );
  }

  async updateLesson(
    _ctx: Ctx,
    courseId: string,
    lessonId: string,
    lessonDetails: LessonDetails
  ): Promise<Result<Lesson>> {
    const course = this.courses.find((c) => c.courseId === courseId);
    if (!course) {
      return err(new CourseNotFoundError(courseId));
    }
    const lesson = course.lessons.find((l) => l.lessonId === lessonId);
    if (!lesson) {
      return err(new LessonNotFoundError(courseId, lessonId));
    }
    lesson.details = lessonDetails;
    return ok(lessonSchema.parse(lesson));
  }

  async deleteLesson(
    _ctx: Ctx,
    courseId: string,
    lessonId: string
  ): Promise<Result<Unit>> {
    const course = this.courses.find((c) => c.courseId === courseId);
    if (!course) {
      return err(new CourseNotFoundError(courseId));
    }
    const lessonIndex = course.lessons.findIndex(
      (l) => l.lessonId === lessonId
    );
    if (lessonIndex === -1) {
      return err(new LessonNotFoundError(courseId, lessonId));
    }
    course.lessons.splice(lessonIndex, 1);
    return ok(unit());
  }
}

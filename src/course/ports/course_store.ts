import { Result } from "@course/error";
import {
  Course,
  CourseDetails,
  Lesson,
  LessonDetails,
  LessonPreview,
} from "@course/domain";
import { Unit } from "@common/unit";
import { Ctx } from "@common/ctx";

export interface CourseStore {
  createCourse(
    ctx: Ctx,
    courseDetails: CourseDetails,
    courseId: string
  ): Promise<Result<Course>>;
  getCourse(ctx: Ctx, courseId: string): Promise<Result<Course>>;
  listCourses(ctx: Ctx): Promise<Result<Course[]>>;
  updateCourse(
    ctx: Ctx,
    courseId: string,
    courseDetails: CourseDetails
  ): Promise<Result<Course>>;
  deleteCourse(ctx: Ctx, courseId: string): Promise<Result<Unit>>;

  createLesson(
    ctx: Ctx,
    courseId: string,
    lessonId: string,
    lessonDetails: LessonDetails
  ): Promise<Result<Lesson>>;
  getLesson(
    ctx: Ctx,
    courseId: string,
    lessonId: string
  ): Promise<Result<Lesson>>;
  listLessons(ctx: Ctx, courseId: string): Promise<Result<LessonPreview[]>>;
  updateLesson(
    ctx: Ctx,
    courseId: string,
    lessonId: string,
    lessonDetails: LessonDetails
  ): Promise<Result<Lesson>>;
  deleteLesson(
    ctx: Ctx,
    courseId: string,
    lessonId: string
  ): Promise<Result<Unit>>;
}

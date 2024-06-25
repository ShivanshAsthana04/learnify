import { Result as BaseResult } from "@common/result";

export class UnexpectedError extends Error {
  cause: unknown;

  constructor(cause: unknown) {
    super("unexpected error");

    this.cause = cause;
  }
}

export class CourseNotFoundError extends Error {
  courseId: string;
  constructor(courseId: string) {
    super(`course not found. courseId: ${courseId}`);

    this.courseId = courseId;
  }
}

export class LessonNotFoundError extends Error {
  courseId: string;
  lessonId: string;
  constructor(courseId: string, lessonId: string) {
    super(`lesson not found. courseId: ${courseId}, lessonId: ${lessonId}`);

    this.courseId = courseId;
    this.lessonId = lessonId;
  }
}
export type Error = UnexpectedError | CourseNotFoundError | LessonNotFoundError;

export type Result<T> = BaseResult<T, Error>;

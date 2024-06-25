import { Result as BaseResult } from "@common/result";

export class UnexpectedError extends Error {
  cause: unknown;

  constructor(cause: unknown) {
    super("unexpected error");

    this.cause = cause;
  }
}

export class EnrollmentAlreadyExistsError extends Error {
  courseId: string;
  userId: string;

  constructor(courseId: string, userId: string) {
    super(
      `enrollment already exists. courseId: ${courseId}, userId: ${userId}`
    );

    this.courseId = courseId;
    this.userId = userId;
  }
}

export type Error = UnexpectedError | EnrollmentAlreadyExistsError;

export type Result<T> = BaseResult<T, Error>;

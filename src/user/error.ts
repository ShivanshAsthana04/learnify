import { Result as BaseResult } from "@common/result";

export class UnexpectedError extends Error {
  cause: unknown;

  constructor(cause: unknown) {
    super("unexpected error");

    this.cause = cause;
  }
}

export class EmailAlreadyInUseError extends Error {
  email: string;

  constructor(email: string) {
    super(`email already in use. email: ${email}`);

    this.email = email;
  }
}

export class InvalidEmailAndPasswordCombinationError extends Error {
  constructor() {
    super("invalid email and password combination.");
  }
}

export class UserNotFoundError extends Error {
  email: string;
  constructor(email: string) {
    super(`user not found. email: ${email}`);

    this.email = email;
  }
}

export type Error =
  | UnexpectedError
  | EmailAlreadyInUseError
  | InvalidEmailAndPasswordCombinationError
  | UserNotFoundError;

export type Result<T> = BaseResult<T, Error>;

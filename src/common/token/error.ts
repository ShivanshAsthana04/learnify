import { Result as BaseResult } from "@common/result";

export class InvalidTokenError extends Error {
  constructor() {
    super("token was invalid, or expired.");
  }
}

export type Error = InvalidTokenError;

export type Result<T> = BaseResult<T, Error>;

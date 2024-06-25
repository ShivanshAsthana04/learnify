export type Result<T, E> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: E;
    };

export const ok = <T, E>(data: T) =>
  ({
    ok: true,
    data,
  }) satisfies Result<T, E>;

export const err = <T, E>(error: E) =>
  ({
    ok: false,
    error,
  }) satisfies Result<T, E>;

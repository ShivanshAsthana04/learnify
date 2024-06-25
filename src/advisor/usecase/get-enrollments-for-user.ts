import { EnrollmentStore } from "@advisor/ports";
import { err, ok } from "@common/result";
import { z } from "zod";

export const getEnrollmentsForUserRequestSchema = z.object({
  userId: z.string(),
});

export type GetEnrollmentsForUserRequest = z.infer<
  typeof getEnrollmentsForUserRequestSchema
>;

export const getEnrollmentsForUserResponseSchema = z.object({
  courseIds: z.array(z.string()),
});

export type GetEnrollmentsForUserResponse = z.infer<
  typeof getEnrollmentsForUserResponseSchema
>;

export const getEnrollmentsForUserProvider =
  (store: EnrollmentStore) =>
  async ({ userId }: GetEnrollmentsForUserRequest) => {
    const enrollmentsResult = await store.getEnrollmentsForUser(userId);
    if (!enrollmentsResult.ok) return err(enrollmentsResult.error);
    const enrollments = enrollmentsResult.data;

    return ok(
      getEnrollmentsForUserResponseSchema.parse({
        courseIds: enrollments.map((enrollment) => enrollment.courseId),
      })
    );
  };

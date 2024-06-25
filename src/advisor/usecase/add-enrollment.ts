import { enrollmentSchema } from "@advisor/domain/enrollment";
import { EnrollmentStore } from "@advisor/ports/enrollment_store";
import { Ctx } from "@common/ctx";
import { z } from "zod";

export const addEnrollmentRequestSchema = z.object({
  courseId: z.string(),
});

export type AddEnrollmentRequest = z.infer<typeof addEnrollmentRequestSchema>;

export const addEnrollmentProvider =
  (store: EnrollmentStore) =>
  async (ctx: Ctx, { courseId }: AddEnrollmentRequest) => {
    return store.addEnrollment(
      enrollmentSchema.parse({
        courseId,
        userId: ctx.user!.userId,
      })
    );
  };

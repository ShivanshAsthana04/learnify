import { z } from "zod";

export const enrollmentSchema = z.object({
  courseId: z.string(),
  userId: z.string(),
});

export type Enrollment = z.infer<typeof enrollmentSchema>;

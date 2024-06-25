import { Ctx } from "@common/ctx";
import { courseDetailsSchema } from "@course/domain";
import { CourseStore } from "@course/ports";
import { z } from "zod";

export const updateCourseRequestSchema = z.object({
  courseId: z.string(),
  courseDetails: courseDetailsSchema,
});

export type UpdateCourseRequest = z.infer<typeof updateCourseRequestSchema>;

export const updateCourseProvider =
  (store: CourseStore) =>
  async (ctx: Ctx, { courseId, courseDetails }: UpdateCourseRequest) => {
    return store.updateCourse(ctx, courseId, courseDetails);
  };

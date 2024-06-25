import { Ctx } from "@common/ctx";
import { CourseStore } from "@course/ports";
import { z } from "zod";

export const getCourseRequestSchema = z.object({
  courseId: z.string(),
});

export type GetCourseRequest = z.infer<typeof getCourseRequestSchema>;

export const getCourseProvider =
  (store: CourseStore) => async (ctx: Ctx, request: GetCourseRequest) => {
    return store.getCourse(ctx, request.courseId);
  };

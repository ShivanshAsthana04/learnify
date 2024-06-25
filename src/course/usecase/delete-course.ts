import { Ctx } from "@common/ctx";
import { CourseStore } from "@course/ports";
import { z } from "zod";

export const deleteCourseRequestSchema = z.object({
  courseId: z.string(),
});

export type DeleteCourseRequest = z.infer<typeof deleteCourseRequestSchema>;

export const deleteCourseProvider =
  (store: CourseStore) => async (ctx: Ctx, request: DeleteCourseRequest) => {
    return store.deleteCourse(ctx, request.courseId);
  };

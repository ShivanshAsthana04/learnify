import { Ctx } from "@common/ctx";
import { CourseStore } from "@course/ports";
import { z } from "zod";

export const listLessonsRequestSchema = z.object({
  courseId: z.string(),
});

export type ListLessonsRequest = z.infer<typeof listLessonsRequestSchema>;

export const listLessonsProvider =
  (store: CourseStore) => async (ctx: Ctx, request: ListLessonsRequest) => {
    return store.listLessons(ctx, request.courseId);
  };

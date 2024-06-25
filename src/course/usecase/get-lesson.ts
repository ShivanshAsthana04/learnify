import { Ctx } from "@common/ctx";
import { CourseStore } from "@course/ports";
import { z } from "zod";

export const getLessonRequestSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
});

export type GetLessonRequest = z.infer<typeof getLessonRequestSchema>;

export const getLessonProvider =
  (store: CourseStore) => async (ctx: Ctx, request: GetLessonRequest) => {
    return store.getLesson(ctx, request.courseId, request.lessonId);
  };

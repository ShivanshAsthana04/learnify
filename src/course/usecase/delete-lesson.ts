import { Ctx } from "@common/ctx";
import { CourseStore } from "@course/ports";
import { z } from "zod";

export const deleteLessonRequestSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
});

export type DeleteLessonRequest = z.infer<typeof deleteLessonRequestSchema>;

export const deleteLessonProvider =
  (store: CourseStore) => async (ctx: Ctx, request: DeleteLessonRequest) => {
    return store.deleteLesson(ctx, request.courseId, request.lessonId);
  };

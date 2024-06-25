import { Ctx } from "@common/ctx";
import { lessonDetailsSchema } from "@course/domain";
import { CourseStore } from "@course/ports";
import { z } from "zod";

export const updateLessonRequestSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
  lessonDetails: lessonDetailsSchema,
});

export type UpdateLessonRequest = z.infer<typeof updateLessonRequestSchema>;

export const updateLessonProvider =
  (store: CourseStore) => async (ctx: Ctx, request: UpdateLessonRequest) => {
    return store.updateLesson(
      ctx,
      request.courseId,
      request.lessonId,
      request.lessonDetails
    );
  };

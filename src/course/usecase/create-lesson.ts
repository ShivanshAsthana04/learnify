import { v7 as uuidv7 } from "uuid";
import { Ctx } from "@common/ctx";
import { lessonDetailsSchema } from "@course/domain";
import { CourseStore } from "@course/ports";
import { z } from "zod";

export const createLessonRequestSchema = z.object({
  courseId: z.string(),
  lessonDetails: lessonDetailsSchema,
});

export type CreateLessonRequest = z.infer<typeof createLessonRequestSchema>;

export const createLessonProvider =
  (store: CourseStore) => async (ctx: Ctx, request: CreateLessonRequest) => {
    const lessonId = uuidv7();
    return store.createLesson(
      ctx,
      request.courseId,
      lessonId,
      request.lessonDetails
    );
  };

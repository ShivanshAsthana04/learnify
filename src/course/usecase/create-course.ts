import { v7 as uuidv7 } from "uuid";
import { Ctx } from "@common/ctx";
import { courseDetailsSchema } from "@course/domain";
import { CourseStore } from "@course/ports";
import { z } from "zod";

export const createCourseRequestSchema = courseDetailsSchema;

export type CreateCourseRequest = z.infer<typeof createCourseRequestSchema>;

export const createCourseProvider =
  (store: CourseStore) => async (ctx: Ctx, request: CreateCourseRequest) => {
    const courseId = uuidv7();
    return store.createCourse(ctx, request, courseId);
  };

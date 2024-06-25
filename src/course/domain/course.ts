import { z } from "zod";
import {
  descriptionSchema,
  instructorNameSchema,
  syllabusSchema,
  titleSchema,
} from "./value_objects";

export const courseDetailsSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  syllabus: syllabusSchema,
  instructorName: instructorNameSchema,
});

export type CourseDetails = z.infer<typeof courseDetailsSchema>;

export const lessonContentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    body: z.string(),
  }),
  z.object({
    type: z.literal("video"),
    url: z.string().url(),
  }),
]);

export const lessonDetailsSchema = z.object({
  title: titleSchema,
  content: lessonContentSchema,
});

export type LessonDetails = z.infer<typeof lessonDetailsSchema>;

export const lessonSchema = z.object({
  lessonId: z.string(),
  details: lessonDetailsSchema,
  createdAt: z.coerce.date(),
});

export type Lesson = z.infer<typeof lessonSchema>;

export const lessonPreviewSchema = z.object({
  lessonId: z.string(),
  title: titleSchema,
  type: z.enum(["text", "video"]),
  createdAt: z.coerce.date(),
});

export type LessonPreview = z.infer<typeof lessonPreviewSchema>;

export const courseSchema = z.object({
  courseId: z.string(),
  details: courseDetailsSchema,
  lessonCount: z.coerce.number(),
});

export type Course = z.infer<typeof courseSchema>;

import { z } from "zod";

export const titleSchema = z.string().min(1).max(100);
export const descriptionSchema = z.string().min(1).max(1000);
export const syllabusSchema = z.string().min(1).max(1000);
export const instructorNameSchema = z.string().min(1).max(100);

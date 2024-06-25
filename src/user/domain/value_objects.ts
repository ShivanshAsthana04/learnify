import { z } from "zod";
import { PASSWORD_REGEX } from "@common/constants";

export const userIdSchema = z.string();

export const usernameSchema = z
  .string()
  .min(1, { message: "username must not be empty" })
  .max(20, { message: "username can not be more than 20 characters" });

export const emailSchema = z
  .string()
  .email({ message: "must be a valid email" });

export const passwordSchema = z
  .string()
  .min(1, { message: "password must not be empty" })
  .max(20, { message: "password can not be more than 20 characters" })
  .regex(PASSWORD_REGEX, {
    message:
      "password must contain a lowercase letter, an uppercase letter and a special character",
  });

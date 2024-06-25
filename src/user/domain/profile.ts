import { z } from "zod";
import { emailSchema, userIdSchema, usernameSchema } from "./value_objects";

export const profileSchema = z.object({
  userId: userIdSchema,
  username: usernameSchema,
  email: emailSchema,
  admin: z.boolean(),
});

export type Profile = z.infer<typeof profileSchema>;

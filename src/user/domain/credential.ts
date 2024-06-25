import { z } from "zod";
import { emailSchema, passwordSchema } from "./value_objects";

export const credentialSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type Credential = z.infer<typeof credentialSchema>;

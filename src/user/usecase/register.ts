import { v7 as uuidv7 } from "uuid";
import {
  credentialSchema,
  emailSchema,
  passwordSchema,
  profileSchema,
  usernameSchema,
} from "@user/domain";
import { UserStore } from "@user/ports";
import { z } from "zod";

export const registerUserRequestSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterUserRequest = z.infer<typeof registerUserRequestSchema>;

export const registerUserProvider =
  (store: UserStore) =>
  async ({ username, email, password }: RegisterUserRequest) => {
    const profile = profileSchema.parse({
      userId: uuidv7(),
      username,
      email,
      admin: email.includes("admin"),
    });

    const credential = credentialSchema.parse({
      email,
      password,
    });

    return store.createUser(profile, credential);
  };

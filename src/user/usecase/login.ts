import { emailSchema, passwordSchema } from "@user/domain";
import { UserStore } from "@user/ports";
import { z } from "zod";
import { InvalidEmailAndPasswordCombinationError } from "@user/error";
import { err } from "@common/result";
import { ok } from "@common/result";
import { tokenSchema, TokenService } from "@common/token";

export const loginUserRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginUserRequest = z.infer<typeof loginUserRequestSchema>;

const loginUserResponseSchema = z.object({
  accessToken: tokenSchema,
});

export type LoginUserResponse = z.infer<typeof loginUserResponseSchema>;

export const loginUserProvider =
  (store: UserStore, tokenService: TokenService) =>
  async ({ email, password }: LoginUserRequest) => {
    const savedCredentialsResult = await store.getSavedCredentials(email);
    if (!savedCredentialsResult.ok) return err(savedCredentialsResult.error);

    if (password !== savedCredentialsResult.data.password)
      return err(new InvalidEmailAndPasswordCombinationError());

    const profileResult = await store.getProfileByEmail(email);
    if (!profileResult.ok) return err(profileResult.error);
    const profile = profileResult.data;

    const accessToken = tokenService.makeToken({
      userId: profile.userId,
      email: profile.email,
      role: profile.admin ? "admin" : "user",
    });

    return ok(
      loginUserResponseSchema.parse({
        accessToken,
      })
    );
  };

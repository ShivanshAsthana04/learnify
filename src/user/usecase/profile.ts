import { emailSchema, passwordSchema, usernameSchema } from "@user/domain";
import { UserStore } from "@user/ports";
import { z } from "zod";
import { InvalidEmailAndPasswordCombinationError } from "@user/error";
import { err } from "@common/result";
import { ok } from "@common/result";
import { tokenSchema, TokenService } from "@common/token";

export const userProfileRequestSchema = z.object({
  userId: z.string(),
});

export type UserProfileRequest = z.infer<typeof userProfileRequestSchema>;

const userProfileResponseSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  admin: z.boolean(),
});

export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;

export const getUserProfileProvider =
  (store: UserStore) =>
  async ({ userId }: UserProfileRequest) => {
    const profileResult = await store.getProfile(userId);
    if (!profileResult.ok) return err(profileResult.error);
    const profile = profileResult.data;

    return ok(userProfileResponseSchema.parse(profile));
  };

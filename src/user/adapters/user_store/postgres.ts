import {
  EmailAlreadyInUseError,
  Result,
  UnexpectedError,
  UserNotFoundError,
} from "@user/error";
import {
  Profile,
  Credential,
  credentialSchema,
  profileSchema,
} from "@user/domain";
import { UserStore } from "@user/ports";
import { unit, Unit } from "@common/unit";
import { err, ok } from "@common/result";
import { db } from "@postgres";

export class PostgresUserStore implements UserStore {
  async createUser(
    profile: Profile,
    credential: Credential
  ): Promise<Result<Unit>> {
    try {
      await db
        .insertInto("users")
        .values({
          user_id: profile.userId,
          username: profile.username,
          email: profile.email,
          admin: profile.admin,
          password: credential.password,
        })
        .execute();
      return ok(unit());
    } catch (error: any) {
      if (error.code === "23505") {
        // unique_violation
        return err(new EmailAlreadyInUseError(profile.email));
      }
      console.error("[PostgresUserStore.createUser]", error);
      return err(new UnexpectedError(error));
    }
  }

  async getSavedCredentials(email: string): Promise<Result<Credential>> {
    try {
      const row = await db
        .selectFrom("users")
        .select(["password"])
        .where("email", "=", email)
        .executeTakeFirst();

      if (!row) {
        return err(new UserNotFoundError(email));
      }

      const credential = credentialSchema.parse({
        password: row.password,
        email,
      });
      return ok(credential);
    } catch (error: unknown) {
      console.error("[PostgresUserStore.getSavedCredentials]", error);
      return err(new UnexpectedError(error));
    }
  }

  async getProfileByEmail(email: string): Promise<Result<Profile>> {
    try {
      const row = await db
        .selectFrom("users")
        .select(["user_id", "username", "email", "admin"])
        .where("email", "=", email)
        .executeTakeFirst();

      if (!row) {
        return err(new UserNotFoundError(email));
      }

      const profile = profileSchema.parse({
        userId: row.user_id,
        username: row.username,
        email: row.email,
        admin: row.admin,
      });
      return ok(profile);
    } catch (error: unknown) {
      console.error("[PostgresUserStore.getProfileByEmail]", error);
      return err(new UnexpectedError(error));
    }
  }

  async getProfile(userId: string): Promise<Result<Profile>> {
    try {
      const row = await db
        .selectFrom("users")
        .select(["username", "email", "admin"])
        .where("user_id", "=", userId)
        .executeTakeFirst();

      if (!row) {
        return err(new UserNotFoundError(userId));
      }

      const profile = profileSchema.parse({
        userId,
        username: row.username,
        email: row.email,
        admin: row.admin,
      });
      return ok(profile);
    } catch (error: unknown) {
      console.error("[PostgresUserStore.getProfile]", error);
      return err(new UnexpectedError(error));
    }
  }
}

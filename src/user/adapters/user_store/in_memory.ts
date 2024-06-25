import { EmailAlreadyInUseError, Result, UserNotFoundError } from "@user/error";
import {
  Profile,
  Credential,
  credentialSchema,
  profileSchema,
} from "@user/domain";
import { UserStore } from "@user/ports";
import { unit, Unit } from "@common/unit";
import { err, ok } from "@common/result";

type Row = Profile & Credential;

export class InMemoryUserStore implements UserStore {
  users: Row[] = [];

  async createUser(
    profile: Profile,
    credential: Credential
  ): Promise<Result<Unit>> {
    if (this.users.find(({ email }) => email === profile.email)) {
      return err(new EmailAlreadyInUseError(profile.email));
    }

    this.users = [{ ...profile, ...credential }, ...this.users];

    return ok(unit());
  }

  async getSavedCredentials(email: string): Promise<Result<Credential>> {
    const row = this.users.find((row) => row.email === email);
    if (!row) {
      return err(new UserNotFoundError(email));
    }

    return ok(credentialSchema.parse(row));
  }

  async getProfileByEmail(email: string): Promise<Result<Profile>> {
    const row = this.users.find((row) => row.email === email);
    if (!row) {
      return err(new UserNotFoundError(email));
    }

    return ok(profileSchema.parse(row));
  }

  async getProfile(userId: string): Promise<Result<Profile>> {
    const row = this.users.find((row) => row.userId === userId);
    if (!row) {
      return err(new UserNotFoundError(userId));
    }

    return ok(profileSchema.parse(row));
  }
}

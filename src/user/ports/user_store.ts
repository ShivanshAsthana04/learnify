import { Result } from "@user/error";
import { Profile, Credential } from "@user/domain";
import { Unit } from "@common/unit";

export interface UserStore {
  createUser(profile: Profile, credential: Credential): Promise<Result<Unit>>;
  getSavedCredentials(email: string): Promise<Result<Credential>>;
  getProfileByEmail(email: string): Promise<Result<Profile>>;
  getProfile(userId: string): Promise<Result<Profile>>;
}

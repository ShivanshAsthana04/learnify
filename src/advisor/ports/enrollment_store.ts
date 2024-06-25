import { Enrollment } from "@advisor/domain/enrollment";
import { Result } from "@advisor/error";
import { Unit } from "@common/unit";

export interface EnrollmentStore {
  addEnrollment(enrollment: Enrollment): Promise<Result<Unit>>;
  getEnrollmentsForUser(userId: string): Promise<Result<Enrollment[]>>;
}

import { Enrollment, enrollmentSchema } from "@advisor/domain/enrollment";
import { EnrollmentStore } from "@advisor/ports";
import { err, ok } from "@common/result";
import { unit, Unit } from "@common/unit";
import { UnexpectedError, Result } from "@advisor/error";
import { db } from "@postgres";

export class PostgresEnrollmentStore implements EnrollmentStore {
  async getEnrollmentsForUser(userId: string): Promise<Result<Enrollment[]>> {
    try {
      const rows = await db
        .selectFrom("enrollments")
        .select(["course_id"])
        .where("user_id", "=", userId)
        .execute();

      return ok(
        rows.map((row) =>
          enrollmentSchema.parse({ courseId: row.course_id, userId })
        )
      );
    } catch (error: any) {
      console.error("[PostgresEnrollmentStore.getEnrollmentsForUser]", error);
      return err(new UnexpectedError(error));
    }
  }

  async addEnrollment(enrollment: Enrollment): Promise<Result<Unit>> {
    try {
      await db
        .insertInto("enrollments")
        .values({
          user_id: enrollment.userId,
          course_id: enrollment.courseId,
        })
        .execute();
      return ok(unit());
    } catch (error: any) {
      console.error("[PostgresEnrollmentStore.addEnrollment]", error);
      return err(new UnexpectedError(error));
    }
  }
}

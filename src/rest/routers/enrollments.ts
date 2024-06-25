import express from "express";
import { EnrollmentStore } from "@advisor/ports";
import {
  getEnrollmentsForUserProvider,
  getEnrollmentsForUserRequestSchema,
} from "@advisor/usecase/get-enrollments-for-user";
import { sendAdvisorDomainError } from "../client-error";
import { addEnrollmentProvider, addEnrollmentRequestSchema } from "@advisor/usecase/add-enrollment";

export const enrollmentsRouter = (enrollmentsStore: EnrollmentStore) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const getEnrollmentsForUserRequest =
      getEnrollmentsForUserRequestSchema.parse({
        userId: req.ctx.user!.userId,
      });
    const getEnrollmentsForUser =
      getEnrollmentsForUserProvider(enrollmentsStore);
    const result = await getEnrollmentsForUser(getEnrollmentsForUserRequest);
    if (result.ok) {
      res.status(200).send(result.data);
    } else {
      sendAdvisorDomainError(res, result.error);
    }
  });

  router.post("/", async (req, res) => {
    const addEnrollmentRequest = addEnrollmentRequestSchema.parse(req.body);
    const addEnrollment = addEnrollmentProvider(enrollmentsStore);
    const result = await addEnrollment(req.ctx, addEnrollmentRequest);
    if (result.ok) {
      res.status(201).send();
    } else {
      sendAdvisorDomainError(res, result.error);
    }
  });

  return router;
};

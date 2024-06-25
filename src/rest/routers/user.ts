import express from "express";
import { UserStore } from "@user/ports";
import {
  getUserProfileProvider,
  userProfileRequestSchema,
} from "@user/usecase/profile";
import { sendUserDomainError } from "../client-error";

export const userRouter = (userStore: UserStore) => {
  const router = express.Router();

  router.get("/me", async (req, res) => {
    const profileRequest = userProfileRequestSchema.parse({
      userId: req.ctx.user!.userId,
    });
    const getProfile = getUserProfileProvider(userStore);
    const result = await getProfile(profileRequest);
    if (result.ok) {
      res.status(200).send(result.data);
    } else {
      sendUserDomainError(res, result.error);
    }
  });

  return router;
};

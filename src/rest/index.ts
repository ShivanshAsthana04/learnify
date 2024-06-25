import "express-async-errors";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { contextResolver, errorMiddleware, requiresAuth } from "./middleware";
import cookieParser from "cookie-parser";
import { config } from "@common/config";
import { JWT } from "@common/token";
import {
  authRouter,
  coursesRouter,
  enrollmentsRouter,
  userRouter,
} from "./routers";
import { PostgresUserStore } from "@user/adapters/user_store/postgres";
import { PostgresCourseStore } from "@course/adapters/course_store/postgres";
import { PostgresEnrollmentStore } from "@advisor/adapters/enrollments_store/postgres";

export const main = () => {
  const userStore = new PostgresUserStore();
  const jwtTokenService = new JWT();

  const coursesStore = new PostgresCourseStore();

  const enrollmentsStore = new PostgresEnrollmentStore();

  const app = express();

  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(morgan("dev"));

  app.use(contextResolver(jwtTokenService));

  app.get("/health", (_, res) => {
    res.status(200).send();
  });

  app.use("/api/auth", authRouter(userStore, jwtTokenService));

  app.use(requiresAuth());

  app.use("/api/users", userRouter(userStore));
  app.use("/api/courses", coursesRouter(coursesStore));
  app.use("/api/enrollments", enrollmentsRouter(enrollmentsStore));

  app.use(errorMiddleware);

  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
};

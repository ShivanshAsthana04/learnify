import { NextFunction, Request, Response } from "express";
import {
  insufficientPermissions,
  sendClientError,
  unauthenticated,
} from "../../rest/client-error";

export const requiresAuth =
  () => (req: Request, res: Response, next: NextFunction) => {
    if (req.ctx.user) {
      next();
    } else {
      sendClientError(res, unauthenticated());
    }
  };

export const requiresAdminPriviliges =
  () => (req: Request, res: Response, next: NextFunction) => {
    if (req.ctx.user && req.ctx.user.role === "admin") {
      next();
    } else {
      sendClientError(res, insufficientPermissions());
    }
  };

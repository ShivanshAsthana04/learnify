import { type Ctx } from "./index";

declare global {
  namespace Express {
    interface Request {
      ctx: Ctx;
    }
  }
}

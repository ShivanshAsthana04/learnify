import { z } from "zod";
import { Result } from "./error";

export const claimsSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
});

export type Claims = z.infer<typeof claimsSchema>;

export const tokenSchema = z.object({
  token: z.string(),
  expirationDate: z.coerce.date(),
});

export type Token = z.infer<typeof tokenSchema>;

export interface TokenService {
  makeToken(payload: Claims): Token;
  verifyToken(token: string): Result<Claims>;
}

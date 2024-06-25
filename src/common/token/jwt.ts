import ms from "ms";
import jwt from "jsonwebtoken";
import { config } from "@common/config";
import { addMilliseconds } from "date-fns";
import { Claims, claimsSchema, Token, TokenService } from "./token_service";
import { InvalidTokenError, Result } from "./error";
import { err, ok } from "@common/result";

export class JWT implements TokenService {
  makeToken(claims: Claims): Token {
    const expirationDate = addMilliseconds(
      new Date(),
      ms(config.ACCESS_TOKEN_EXPIRATION_DURATION)
    );
    const token = jwt.sign(claims, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRATION_DURATION,
    });

    return {
      token,
      expirationDate,
    } satisfies Token;
  }

  verifyToken(token: string): Result<Claims> {
    try {
      const claims = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
      return ok(claimsSchema.parse(claims));
    } catch (e: unknown) {
      return err(new InvalidTokenError());
    }
  }
}

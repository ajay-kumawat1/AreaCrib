import * as jwt from "jsonwebtoken";
import { GetVerificationKey, expressJwtSecret } from "jwks-rsa";

/**
 * Create and store a jwks.expressJwtSecret, to make sure that the cache is used (Instead of creating a new client per request, and not being able to use the cache)
 */
export class ExpressJWTSecret {
  private readonly client: jwt.Secret | GetVerificationKey;
  public constructor() {
    this.client = expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`, // Ensure that the AUTH0_DOMAIN environment variable is set
    }) as jwt.Secret | GetVerificationKey;
  }

  public getClient(): jwt.Secret | GetVerificationKey {
    return this.client;
  }
}

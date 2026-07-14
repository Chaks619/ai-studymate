import type { SafeUser } from "../../modules/user/user.mapper.js";

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

export {};
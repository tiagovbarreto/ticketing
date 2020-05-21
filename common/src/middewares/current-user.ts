import { Request, Response, NextFunction } from "express";
import { JWTHelper } from "../helpers/jwt-helper";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  req.currentUser = JWTHelper.verify(req.session.jwt) as UserPayload;

  next();
};

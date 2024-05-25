import { NextFunction, Request, Response } from "express";
import { ApiError } from "./error-handler";
import { verifyToken } from "../utils/jwtUtils";
require("express-async-errors");

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const authHeader = req.headers.authorization;

  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Authorization token is missing or invalid", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded.userId;
    next();
  } catch (error) {
    throw new ApiError("Invalid or expired token", 401);
  }
};

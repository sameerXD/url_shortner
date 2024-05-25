import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
require("express-async-errors");

// if i give 4 arguements to a middleware node/express automatically figures that this middleware handles error
export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).send({
      errors: [{ message: err.message }],
    });
  }

  if (err instanceof validationError) {
    let formattedError = JSON.parse(err.message).map((error: any) => {
      return { message: error.msg, field: error.path };
    });
    return res.status(400).send({
      errors: formattedError,
    });
  }

  res.status(400).send({
    errors: [{ message: err.message }],
  });
};

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class validationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new validationError(JSON.stringify(errors.array()), 400);
  }

  next();
};

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// if i give 4 arguements to a middleware node/express automatically figures that this middleware handles error
export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errBody: { name: string; message: string } = JSON.parse(err.message);
  console.log(errBody);

  if (errBody.name === "validationError") {
    let formattedError = JSON.parse(errBody.message).map((error: any) => {
      return { message: error.msg, field: error.path };
    });
    return res.status(400).send({
      errors: formattedError,
    });
  }

  res.status(400).send({
    errors: [{ message: errBody.message }],
  });
};

export const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // this line is commented intentionally
    //   return res.status(400).send(errors.array());

    // instead let the application throw error
    let err = {
      name: "validationError",
      message: JSON.stringify(errors.array()),
    };
    return next(new Error(JSON.stringify(err)));
  }

  next();
};

import { Request, Response, NextFunction } from "express";
import User from "../database/models/User";

export const countApi = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const getUser = await User.findOne({ email });
  if (!getUser) {
    return next();
  }

  const requestPath = req.path;

  const prefixes = requestPath.split("/");

  const prefix = prefixes[prefixes.length - 1];
  console.log(prefix);

 

  await getUser.save();

  next();
};

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

  if (prefix === "updateProduct") {
    if (!getUser.updateProductCount) {
      getUser.updateProductCount = 0;
    }
    getUser.updateProductCount++;
  } else if (prefix === "addProduct") {
    if (!getUser.addProductCount) {
      getUser.addProductCount = 0;
    }
    getUser.addProductCount++;
  }

  await getUser.save();

  next();
};

import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User, { IURL } from "../database/models/User";
import { ApiError, validateRequest } from "../middleware/error-handler";
import { countApi } from "../utils/utils";
import { comparePassword, encryptPassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwtUtils";
import { authMiddleware } from "../middleware/auth";
import { generateHash } from "../utils/hashingUtils";
import Url from "../database/models/URL";
require("express-async-errors");
require("dotenv").config();

const router = express.Router();

const baseUrl = process.env.BASE_URL;

router.post(
  "/user/register",
  [
    body("email").isEmail().withMessage("email must be valid!"),
    body("password").isString().withMessage("password must be valid!"),
    body("name").isString().withMessage("name must be valid!"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    const getUser = await User.findOne({
      email,
    });

    if (getUser)
      throw new ApiError(`user with email ${email} already exists`, 400);

    let passwordHash = await encryptPassword(password);

    const user = await User.create({
      email: email,
      name: name,
      password: passwordHash,
    });

    await user.save();

    res.send(user);
  }
);

router.post(
  "/user/login",
  [
    body("email").isEmail().withMessage("email must be valid!"),
    body("password").isString().withMessage("password must be valid!"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const getUser = await User.findOne({
      email: email,
    });

    if (!getUser)
      throw new ApiError(`user with email ${email} does not exits`, 400);

    const isPasswordCorrect = await comparePassword(password, getUser.password);

    if (!isPasswordCorrect) throw new ApiError(`Invalid password`, 401);

    res.send({ user: getUser, token: await generateToken(getUser.id) });
  }
);

router.put(
  "/user/shortenUrl",
  [
    body("originalUrl").isString().withMessage("originalUrl must be valid!"),
    body("maxUses").isNumeric().withMessage("maxUses must be valid!"),
  ],
  validateRequest,
  authMiddleware,
  async (req: Request, res: Response) => {
    const { originalUrl, maxUses } = req.body;

    const hash = generateHash(originalUrl);

    let url = await Url.findOne({
      userId: req.user,
      hash: hash,
    });

    if (url) {
      url.maxUses = maxUses;
      url.maxUses = maxUses || null;
      url.remainingUses = maxUses || null;

      await url.save();
      return res.json({
        shortUrl: `${baseUrl}/user/redirectUrl/${req.user}/${url.hash}`,
      });
    }

    url = new Url({
      originalUrl,
      hash,
      maxUses: maxUses || null,
      remainingUses: maxUses || null,
      userId: req.user,
    });

    await url.save();

    return res.json({
      shortUrl: `${baseUrl}/user/redirectUrl/${req.user}/${url.hash}`,
    });
  }
);

router.delete(
  "/user/deleteHash",
  [body("hash").isString().withMessage("originalUrl must be valid!")],
  validateRequest,
  authMiddleware,
  async (req: Request, res: Response) => {
    const { hash } = req.body;

    await Url.deleteOne({
      userId: req.user,
      hash: hash,
    });
    res.send({});
  }
);

router.get(
  "/user/allUrls",
  authMiddleware,
  async (req: Request, res: Response) => {
    const getAll = await Url.find({
      userId: req.user,
    });

    let fin = [];

    for (let url of getAll) {
      let temp: any = url;
      let tempObj = {
        ...temp._doc,
        fullUrl: url.hash,
      };
      fin.push(tempObj);
    }
    res.send(fin);
  }
);

router.get(
  "/user/redirectUrl/:userId/:hash",
  async (req: Request, res: Response) => {
    const { hash, userId } = req.params;

    const url = await Url.findOne({ hash, userId });

    if (!url) {
      throw new ApiError("url not found", 404);
    }

    if (url.remainingUses !== undefined && url.remainingUses <= 0) {
      throw new ApiError("api usage exhausted!", 410);
    }

    if (url.remainingUses) {
      url.remainingUses--;
    }

    url.clicks++;
    await url.save();

    res.send({ url: url.originalUrl });
  }
);

export default router;

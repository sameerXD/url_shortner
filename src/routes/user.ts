import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User, { IProduct } from "../database/models/User";
import { validateRequest } from "../middleware/error-handler";
import { countApi } from "../middleware/utils";

const router = express.Router();

router.post(
  "/user/login",
  [body("email").isEmail().withMessage("email must be valid!")],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // these lines are commented intentionally segregated this code repetition into a middleware

    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   //   return res.status(400).send(errors.array());

    //   // instead let the application throw error
    //   let err = {
    //     name:"validationError",
    //     message:JSON.stringify(errors.array())
    //   }
    //   return next(new Error(JSON.stringify(err)));
    // }

    const getUser = await User.findOne({
      email: email,
    });

    if (!getUser) {
      const postUser = await User.create({
        email: email,
      });
      await postUser.save();
      return res.send(postUser);
    }
    res.send(getUser);
  }
);

router.post(
  "/user/addProduct",
  [
    body("email").isEmail().withMessage("email must be valid!"),
    body("productName").isString().notEmpty(),
    body("color").isString().notEmpty(),
    body("category").isString().notEmpty(),
    body("price").isNumeric(),
  ],
  validateRequest,
  countApi,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, productName, color, category, price } = req.body;

    const getUser = await User.findOne({ email });
    if (!getUser)
      return next(
        new Error(
          JSON.stringify({
            name: "NotFoundError",
            message: `user with email ${email} not found`,
          })
        )
      );

    const product: IProduct = {
      productName,
      color,
      category,
      price,
    };

    getUser.products = getUser.products
      ? [...getUser.products, product]
      : [product];

    await getUser.save();

    res.send(getUser);
  }
);

router.put(
  "/user/updateProduct",
  [
    body("email").isEmail().withMessage("email must be valid!"),
    body("productName").isString().notEmpty(),
    body("productId").isString().notEmpty(),
    body("color").isString().notEmpty(),
    body("category").isString().notEmpty(),
    body("price").isNumeric(),
  ],
  validateRequest,
  countApi,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, productId, productName, color, category, price } = req.body;

    const getUser = await User.findOne({ email });
    if (!getUser)
      return next(
        new Error(
          JSON.stringify({
            name: "NotFoundError",
            message: `user with email ${email} not found`,
          })
        )
      );

    let product = getUser.products?.filter(
      (product) => product._id == productId
    );

    if (!product || product?.length === 0)
      return next(
        new Error(
          JSON.stringify({
            name: "NotFoundError",
            message: `product with id ${productId} not found`,
          })
        )
      );
    let updateProduct = product[0];
    updateProduct.category = category;
    updateProduct.color = color;
    updateProduct.price = price;
    updateProduct.productName = productName;

    await getUser.save();

    res.send(getUser);
  }
);

export default router;

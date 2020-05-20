import express, { Request, Response } from "express";

import { body } from "express-validator";

import { User } from "../models/user";

import { validateRequest } from "../middewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";
import { JWTHelper } from "../helpers/jwt-helper";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Invalid email or password."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Invalid email or password."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await JWTHelper.compare(user.password, password);

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    //Generate JWT
    const userJwt = await JWTHelper.generateAuthToken(user);

    // Store jwt in session jwt
    req.session = { jwt: userJwt };

    res.status(200).send(user);
  }
);

export { router as signinRouter };

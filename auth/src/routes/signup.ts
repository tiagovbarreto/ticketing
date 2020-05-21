import express, { Request, Response } from "express";
import { body } from "express-validator";

import { User } from "../models/user";

import { validateRequest } from "@braves-corp/common";
import { BadRequestError } from "@braves-corp/common";
import { JWTHelper } from "@braves-corp/common";

const router = express.Router();

router.post(
  "/api/users/signup/",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already registered.");
    }

    const user = User.build({ email, password });
    await user.save();

    //Generate JWT
    const userJwt = await JWTHelper.generateAuthToken(user);

    // Store jwt in session jwt
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signupRouter };

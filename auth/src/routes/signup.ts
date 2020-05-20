import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middewares/validate-request";

import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { JWTHelper } from "../helpers/jwt-helper";

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

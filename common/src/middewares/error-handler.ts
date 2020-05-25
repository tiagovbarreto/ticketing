import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //  console.log("Something went wrong.", err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error(err);

  res.status(500).send({
    errors: [
      { message: "Ops ... something went wrong. Sorry!:" },
      { message: err.message },
    ],
  });
};

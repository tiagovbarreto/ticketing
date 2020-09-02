import express, { Request, Response } from "express";

import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser } from "@braves-corp/common";
import { errorHandler } from "@braves-corp/common";
import { NotFoundError } from "@braves-corp/common";

import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes/index";
import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

const app = express();
app.set("trust proxy", true);
app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(deleteOrderRouter);
app.use(showOrderRouter);

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

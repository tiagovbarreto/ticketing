import express, { Request, Response } from "express";

import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser } from "@braves-corp/common";
import { errorHandler } from "@braves-corp/common";
import { NotFoundError } from "@braves-corp/common";

import { indexTicketRouter } from "./routes/index";
import { createTicketRouter } from "./routes/new";
import { updateTicketRouter } from "./routes/update";
import { showTicketRouter } from "./routes/show";

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

app.use(indexTicketRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);
app.use(showTicketRouter);

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

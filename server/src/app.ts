import express, { Application, Request, Response } from "express";
import connectDB from "./config/database";
import config from "./config/config";
import cors from "cors";

const app: Application = express();
const PORT = config.server.port ?? 5000;
connectDB();

app.use(
  cors({
    origin: config.server.cors.origin,
    credentials: config.server.cors.credentials,
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, (err?: Error) => {
  err
    ? console.log(err)
    : console.log(`Server is running on http://localhost:${PORT}`);
});

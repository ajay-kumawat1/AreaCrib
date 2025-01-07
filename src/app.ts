import express, { Application, Request, Response } from "express";
import connectDB from "./config/database";

const app: Application = express();
const PORT = process.env.PORT ?? 8001;
connectDB();

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, (err?: Error) => {
  err
    ? console.log(err)
    : console.log(`Server is running on http://localhost:${PORT}`);
});

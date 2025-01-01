import express, { Application, Request, Response } from "express";
const app: Application = express();

const PORT: number = 3000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, (err?: Error) => {
  err
    ? console.log(err)
    : console.log(`Server is running on http://localhost:${PORT}`);
});

import express, {
  Application,
  json,
  urlencoded,
  Request,
  Response,
} from "express";
import connectDB from "./config/database";
import config from "./config/config";
import cors from "cors";
import { IndexRoute } from "./routes/index";

const app: Application = express();
const PORT = config.server.port ?? 5000;
connectDB();

app.use(
  cors({
    origin: config.server.cors.origin,
    credentials: config.server.cors.credentials,
  })
);

app.use(json({ limit: "50mb" }));
app.use(urlencoded({ limit: "50mb", extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/", new IndexRoute(app).router);

app.listen(PORT, (err?: Error) => {
  err
    ? console.log(err)
    : console.log(`Server is running on http://localhost:${PORT}`);
});

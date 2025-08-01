import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import LocalityController from "../controllers/LocalityController";

export class LocalityRoute extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "locality", "LocalityRoute");
  }

  public configureRoutes(): Application {
    this.app.route(`${this.path}/getAll`).get(LocalityController.getAll);

    return this.app;
  }
}

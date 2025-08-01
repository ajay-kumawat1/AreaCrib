import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import LocalityController from "../controllers/LocalityController";

export class LocalityRoute extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "locality", "LocalityRoute");
  }

  public configureRoutes(): Application {
    this.app.route(`${this.path}`).post(LocalityController.create);
    this.app.route(`${this.path}/getAll`).get(LocalityController.getAll);
    this.app.route(`${this.path}/:id`).get(LocalityController.getById);
    this.app
      .route(`${this.path}/city/:cityId`)
      .get(LocalityController.getByCity);

    return this.app;
  }
}

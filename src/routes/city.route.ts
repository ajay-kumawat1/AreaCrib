import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import AuthAuthenticator from "../common/middleware/UserAuthenticator";
import CityController from "../controllers/CityController";

export class CityRoute extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "city", "CityRoute");
  }

  public configureRoutes(): Application {
    this.app
      .route(`${this.path}/getAll`)
      .get(AuthAuthenticator.isAuthenticated(), CityController.getAll);

    this.app
      .route(`${this.path}`)
      .post(AuthAuthenticator.isAdminAuthenticated(), CityController.create);

    return this.app;
  }
}

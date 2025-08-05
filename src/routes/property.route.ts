import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import PropertyController from "../controllers/PropertyController";
import AuthAuthenticator from "../common/middleware/UserAuthenticator";

export class PropertyRoutes extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "property", "PropertyRoutes");
  }

  public configureRoutes(): Application {
    this.app
      .route(`${this.path}`)
      .post(AuthAuthenticator.isAuthenticated(), PropertyController.create);

    this.app
      .route(`${this.path}`)
      .get(AuthAuthenticator.isAdminAuthenticated(), PropertyController.getAll);

    this.app
      .route(`${this.path}/getMy`)
      .get(AuthAuthenticator.isAuthenticated(), PropertyController.getMy);

    this.app
      .route(`${this.path}/:id`)
      .get(AuthAuthenticator.isAuthenticated(), PropertyController.getById);

    return this.app;
  }
}

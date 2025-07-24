import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import UserController from "../controllers/UserController";
import AuthAuthenticator from "../common/middleware/UserAuthenticator";

export class UserRoutes extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "user", "UserRoutes");
  }

  public configureRoutes(): Application {
    this.app
      .route(`${this.path}/getMy`)
      .get(AuthAuthenticator.isAuthenticated(), UserController.getMy);

    this.app
      .route(`${this.path}/:id`)
      .get(AuthAuthenticator.isAuthenticated(), UserController.getById);

    this.app
      .route(`${this.path}`)
      .get(AuthAuthenticator.isAdminAuthenticated(), UserController.getAll);

    this.app
      .route(`${this.path}`)
      .put(AuthAuthenticator.isAuthenticated(), UserController.update);

    this.app
      .route(`${this.path}/:id`)
      .delete(AuthAuthenticator.isAuthenticated(), UserController.delete);

    return this.app;
  }
}

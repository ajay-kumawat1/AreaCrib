import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import { validateAuth } from "../middlewares/user.middleware";
import AuthController from "../controllers/AuthController";
import AuthAuthenticator from "../common/middleware/UserAuthenticator";

export class AuthRoutes extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "auth", "AuthRoutes");
  }

  public configureRoutes(): Application {
    this.app.route(`${this.path}`).post(validateAuth, AuthController.create);

    this.app.route(`${this.path}/login`).post(AuthController.login);

    this.app
      .route(`${this.path}/change-password`)
      .post(AuthAuthenticator.isAuthenticated(), AuthController.changePassword);

    this.app
      .route(`${this.path}/forgot-password`)
      .post(AuthController.forgotPassword);

    this.app
      .route(`${this.path}/reset-password/:token`)
      .post(AuthController.resetPassword);

    this.app
      .route(`${this.path}/logout`)
      .post(AuthController.logout);

    return this.app;
  }
}

import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import UserController from "../controllers/UserController";
import UserAuthenticator from "../common/middleware/UserAuthenticator";

export class UserRoutes extends RoutesConfig {
    public constructor(app: Application) {
        super(app, 'users', 'UserRoutes');
    }

    public configureRoutes(): Application {
        this.app.route(`${this.path}`).post(UserController.create);

        this.app.route(`${this.path}/login`).post(UserController.login);

        this.app.route(`${this.path}/change-password`).post(UserAuthenticator.isAuthenticated, UserController.changePassword);

        this.app.route(`${this.path}/forgot-password`).post(UserController.forgotPassword);

        this.app.route(`${this.path}/reset-password/:token`).post(UserController.resetPassword);

        return this.app;
    }
}

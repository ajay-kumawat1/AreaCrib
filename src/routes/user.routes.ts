import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import UserController from "../controllers/UserController";


export class UserRoutes extends RoutesConfig {
    public constructor(app: Application) {
        super(app, 'users', 'UserRoutes');
    }

    public configureRoutes(): Application {
        this.app.route(`${this.path}`).post(UserController.create);

        this.app.route(`${this.path}/login`).post(UserController.login);

        this.app.route(`${this.path}/change-password`).post(UserController.changePassword);

        this.app.route(`${this.path}/forgot-password`).post(UserController.forgotPassword);

        return this.app;
    }
}

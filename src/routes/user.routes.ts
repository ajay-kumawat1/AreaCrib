import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import UserController from "../controllers/UserController";


export class UserRoutes extends RoutesConfig {
    public constructor(app: Application) {
        super(app, 'users', 'UserRoutes');
    }

    public configureRoutes(): Application {
        this.app.route(`${this.path}`).get(UserController.create);

        this.app.route(`${this.path}/login`).get(UserController.login);

        return this.app;
    }
}

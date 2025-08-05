import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import PropertyController from "../controllers/PropertyController";

export class PropertyRoutes extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "property", "PropertyRoutes");
  }

  public configureRoutes(): Application {
    this.app.route(`${this.path}`).get(PropertyController.getAll);

    return this.app;
  }
}

import { Application, Router } from "express";

import { IRoutes } from "../common/interfaces/IRoutes";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";

// Modules
import { AuthRoutes } from "./auth.route";
import { UserRoutes } from "./user.route";
import { CityRoute } from "./city.route";
import { LocalityRoute } from "./locality.route";

export class IndexRoute implements IRoutes {
  public router = Router({ mergeParams: true });
  public routerArray: Array<RoutesConfig> = [];
  public path = "/api";

  public constructor(app: Application) {
    this.initializeRoutes(app);
  }

  private initializeRoutes(app: Application): void {
    this.routerArray.push(new AuthRoutes(app));
    this.routerArray.push(new UserRoutes(app));
    this.routerArray.push(new CityRoute(app));
    this.routerArray.push(new LocalityRoute(app));

    this.routerArray.forEach((route: RoutesConfig) => {
      console.log(`Routes configured for ${route.getName()}`);
    });
  }
}

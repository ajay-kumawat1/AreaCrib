import { ILooseObject } from "../common/interfaces/ILooseObject";
import { IUserDoc, User } from "../models/User";

export default class UserFactory {
  public static generateUser(data: ILooseObject): IUserDoc {
    if (this.checkValidBuildData(data)) {
      return new User(data);
    } else {
      throw new Error("Invalid user data provided for generation");
    }
  }

  public static checkValidBuildData(data: ILooseObject): boolean {
    return (
      !!data &&
      data.firstName &&
      data.lastName &&
      data.email &&
      data.password &&
      data.mobileNumber
    );
  }
}

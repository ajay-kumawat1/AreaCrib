import { NextFunction, Request, Response } from "express";

export default function arrayPolyfill(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Array.prototype.find = function (
    callback: (value: any, index: number, obj: any[]) => boolean
  ): void {
    if (this === null) {
      throw new TypeError("Array.prototype.find called on null or undefined");
    } else if (typeof callback !== "function") {
      throw new TypeError("callback must be a function");
    }
    const list = Object(this);
    // Makes sures is always has an positive integer as length.
    const length = list.length >>> 0;
    // eslint-disable-next-line prefer-rest-params
    const thisArg = arguments[1];
    for (let i = 0; i < length; i++) {
      const element = list[i];
      if (callback.call(thisArg, element, i, list)) {
        return element;
      }
    }
  };
  next();
}

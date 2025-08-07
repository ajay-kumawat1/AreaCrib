import { createLogger, format, transports, Logform } from "winston";
import config from "../config/config";

const logFormats: Logform.Format[] = [
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
  format.align(),
  format.printf((info: Logform.TransformableInfo) => {
    const { timestamp: _timestamp, level, message, ...args } = info;
    return `{"level": "${level}", "message": "${message}", "data":  ${
      Object.keys(args).length ? JSON.stringify({ ...args }) : ""
    }`;
  }),
];

const coloredOutput = format.combine(...logFormats);

const logger = createLogger({
  transports: [
    new transports.Console({
      level: config.server.logLevel || "info",
      format: coloredOutput,
    }),
  ],
});

export { logger };

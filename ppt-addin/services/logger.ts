import winston from "winston";

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

/**
 * Winston logger
 */
const logger: winston.Logger = winston.createLogger({
  levels: logLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[CF-LOG] ${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;

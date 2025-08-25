import pino from "pino";
import env from "./env";

const logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			levelFirst: true,
			translateTime: "HH:MM:ss",
			ignore: "pid,hostname",
		},
	},
	level: env.LOG_LEVEL || "info",
});

export { logger };

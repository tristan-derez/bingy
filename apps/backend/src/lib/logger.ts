import pino from "pino";
import env from "./env";

const logger = pino({
	transport:
		env.NODE_ENV === "development"
			? {
					target: "pino-pretty",
					options: {
						colorize: true,
						levelFirst: true,
						translateTime: "HH:MM:ss",
						ignore: "pid,hostname",
					},
				}
			: undefined,
	level: env.LOG_LEVEL || "info",
});

export { logger };

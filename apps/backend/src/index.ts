import { serve } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger as httpLogger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { connection } from "#lib/database";
import env from "#lib/env";
import { logger } from "#lib/logger";
import { serveInternalServerError } from "#web/controllers/responses/error";
import users from "#web/routes/users";

const app = new Hono();
app.use(cors());
app.use(httpLogger());
app.use(trimTrailingSlash());

const pingDB = async () => {
	try {
		await connection`SELECT 1 as ping`;
		logger.info("Database connection established");
	} catch {
		logger.error("Failed to connect to the database.");
	}
};

pingDB();

app.route("/users", users);

app.onError((err, c) => {
	return serveInternalServerError(c, err);
});

if (env.NODE_ENV === "development") {
	console.log("Available routes:");
	showRoutes(app);
}

const port = Number(env.PORT);
logger.info(`Server is running on port ${port} and env: ${env.NODE_ENV}`);

const web = serve({
	fetch: app.fetch,
	port,
});

process.on("SIGINT", () => {
	logger.info("Shutting down server...");
	web.stop();
	process.exit(0);
});

export default app;

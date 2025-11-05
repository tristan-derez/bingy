import { serve } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger as httpLogger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import type { auth } from "#lib/auth";
import { connection } from "#lib/database";
import env from "#lib/env";
import { logger } from "#lib/logger";
import { serveInternalServerError } from "#lib/responses/error";
import { sessionMiddleware } from "#web/middlewares/session";
import authRoutes from "#web/routes/auth";
import certificationRoutes from "#web/routes/certification";
import collectionRoutes from "#web/routes/collection";
import companyRoutes from "#web/routes/company";
import creditRoutes from "#web/routes/credit";
import discoverRoutes from "#web/routes/discover";
import findRoutes from "#web/routes/find";
import genreRoutes from "#web/routes/genre";
import movieRoutes from "#web/routes/movie";
import networkRoutes from "#web/routes/network";
import personRoutes from "#web/routes/person";
import searchRoutes from "#web/routes/search";
import trendingRoutes from "#web/routes/trending";
import tvRoutes from "#web/routes/tv";
import watchProvidersRoutes from "#web/routes/watch-providers";

declare global {
	var __routesShown: boolean | undefined;
}

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>();

app.use(
	"*",
	cors({
		origin: env.FRONT_URL,
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

const api = new Hono();
app.use(httpLogger());
app.use(trimTrailingSlash());
app.use("/assets/*", serveStatic({ root: "./src" }));

const pingDB = async () => {
	try {
		await connection`SELECT 1 as ping`;
		logger.info("Database connection established");
	} catch {
		logger.error("Failed to connect to the database.");
	}
};

pingDB();

app.use("*", sessionMiddleware);
api.route("/auth", authRoutes);
api.route("/movies", movieRoutes);
api.route("/tv", tvRoutes);
api.route("/person", personRoutes);
api.route("/search", searchRoutes);
api.route("/trending", trendingRoutes);
api.route("network", networkRoutes);
api.route("/discover", discoverRoutes);
api.route("/genre", genreRoutes);
api.route("/find", findRoutes);
api.route("credit", creditRoutes);
api.route("collection", collectionRoutes);
api.route("certification", certificationRoutes);
api.route("company", companyRoutes);
api.route("watch/providers", watchProvidersRoutes);
app.route("/api", api);

app.onError((err, c) => {
	return serveInternalServerError(c, err);
});

if (env.NODE_ENV === "development") {
	if (!global.__routesShown) {
		console.log("Available routes:");
		showRoutes(app);
		global.__routesShown = true;
	}
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

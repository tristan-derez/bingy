import "./migrate";
import { serve } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger as httpLogger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import type { auth } from "./lib/auth";
import { cacheClient } from "./lib/cache-client";
import { connection } from "./lib/database";
import env from "./lib/env";
import { logger } from "./lib/logger";
import { serveInternalServerError } from "./lib/responses/error";
import { sessionMiddleware } from "./web/middlewares/session";
import authRoutes from "./web/routes/auth";
import certificationRoutes from "./web/routes/certification";
import collectionRoutes from "./web/routes/collection";
import companyRoutes from "./web/routes/company";
import creditRoutes from "./web/routes/credit";
import discoverRoutes from "./web/routes/discover";
import findRoutes from "./web/routes/find";
import genreRoutes from "./web/routes/genre";
import healthRoutes from "./web/routes/health";
import movieRoutes from "./web/routes/movie";
import networkRoutes from "./web/routes/network";
import personRoutes from "./web/routes/person";
import ratingRoutes from "./web/routes/rating";
import searchRoutes from "./web/routes/search";
import trendingRoutes from "./web/routes/trending";
import tvRoutes from "./web/routes/tv";
import userProfileRoutes from "./web/routes/user";
import userFavoriteRoutes from "./web/routes/user-favorites";
import userHistoryRoutes from "./web/routes/user-history";
import userListRoutes from "./web/routes/user-list";
import userProgressRoutes from "./web/routes/user-progress";
import watchProvidersRoutes from "./web/routes/watch-providers";

declare global {
	var __cacheFlushed: boolean | undefined;
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
		origin: [env.FRONT_URL, "http://localhost:5173"],
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "DELETE", "PUT", "OPTIONS", "PATCH"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.use(httpLogger());
app.use(trimTrailingSlash());
app.use("/assets/*", serveStatic({ root: "./src" }));

const pingDB = async () => {
	try {
		await connection`SELECT 1 as ping`;
		logger.info("Database connection established");
	} catch (error) {
		logger.error(error, "Failed to connect to the database.");
	}
};

pingDB();

app.use("*", sessionMiddleware);
const api = new Hono();
api.route("/auth", authRoutes);
api.route("/health", healthRoutes);
api.route("/lists", userListRoutes);
api.route("/history", userHistoryRoutes);
api.route("/progress", userProgressRoutes);
api.route("/favorites", userFavoriteRoutes);
api.route("/rating", ratingRoutes);
api.route("/user", userProfileRoutes);
api.route("/movies", movieRoutes);
api.route("/tv", tvRoutes);
api.route("/person", personRoutes);
api.route("/search", searchRoutes);
api.route("/trending", trendingRoutes);
api.route("/network", networkRoutes);
api.route("/discover", discoverRoutes);
api.route("/genre", genreRoutes);
api.route("/find", findRoutes);
api.route("/credit", creditRoutes);
api.route("/collection", collectionRoutes);
api.route("/certification", certificationRoutes);
api.route("/company", companyRoutes);
api.route("/watch/providers", watchProvidersRoutes);
app.route("/api", api);

app.onError((err, c) => {
	return serveInternalServerError(c, err);
});

if (env.NODE_ENV === "development") {
	if (!global.__cacheFlushed) {
		await cacheClient.flush();
		logger.info("Cache flushed on dev startup");
		global.__cacheFlushed = true;
	}
}

const port = Number(env.PORT);
logger.info(`Server is running on port ${port} and env: ${env.NODE_ENV}`);

const serverConfig = {
	fetch: app.fetch,
	port,
	hostname: "0.0.0.0",
};

const server = serve(serverConfig);

process.on("SIGINT", () => {
	logger.info("Shutting down server...");
	server.stop();
	process.exit(0);
});

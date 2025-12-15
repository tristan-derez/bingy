import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const serveData = <T>(c: Context, data: T) => {
	return c.json({ data });
};

const serve = <T>(c: Context, data: T, status: ContentfulStatusCode) => {
	return c.json({ data }, status);
};

const serveNoContent = (c: Context) => {
	return c.body(null, 204);
};

const serveCreated = <T>(c: Context, data: T, status: ContentfulStatusCode) => {
	return c.json({ data }, status);
};

export { serve, serveData, serveNoContent, serveCreated };

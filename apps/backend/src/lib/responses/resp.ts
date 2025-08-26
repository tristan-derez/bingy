import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const serveData = <T>(c: Context, data: T) => {
	return c.json({ data });
};

const serve = <T>(c: Context, status: ContentfulStatusCode, data: T) => {
	return c.json({ data }, status);
};

export { serve, serveData };

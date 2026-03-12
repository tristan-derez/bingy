import { type Context, Hono } from "hono";
import { auth } from "../../lib/auth";

const authRoutes = new Hono();

authRoutes.all("*", (c: Context) => {
	return auth.handler(c.req.raw);
});

export default authRoutes;

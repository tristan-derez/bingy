import { Hono } from "hono";

const healthRoutes = new Hono();

healthRoutes.get("/", (c) => {
	return c.json({ status: "ok" }, 200);
});

export default healthRoutes;

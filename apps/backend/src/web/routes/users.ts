import { Hono } from "hono";

const app = new Hono();

const users = [
	{ id: 1, name: "Alice", email: "alice@example.com" },
	{ id: 2, name: "Bob", email: "bob@example.com" },
	{ id: 3, name: "Charlie", email: "charlie@example.com" },
];

app.get("/", (c) => {
	return c.json({ data: users });
});

app.post("/", (c) => c.json("create an user", 201));

app.get("/:id", (c) => {
	const id = Number(c.req.param("id"));
	const user = users.find((u) => u.id === id);

	if (!user) {
		return c.json({ error: "User not found" }, 404);
	}

	return c.json({ data: user });
});

export default app;

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context }) => {
		if (!context.session?.user) {
			throw redirect({ to: "/signin" });
		}
		return { user: context.session.user };
	},
});

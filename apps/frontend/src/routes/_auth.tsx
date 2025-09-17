import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient } from "@/integrations/tanstack-query/root-provider";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async () => {
		const session = await queryClient.fetchQuery({
			queryKey: ["session"],
			queryFn: () => authClient.getSession().then((res) => res.data),
		});

		if (!session?.user) {
			throw redirect({ to: "/signin" });
		}
	},
});

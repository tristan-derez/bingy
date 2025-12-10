import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { GlobalError } from "@/components/errors/global-error";
import { NotFoundComponent } from "@/components/errors/not-found";
import { RootComponent } from "@/components/root-component";
import { authClient } from "@/lib/auth-client";
import appCss from "@/styles/app.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
	session?: Awaited<ReturnType<typeof authClient.getSession>>["data"];
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context: _ }) => {
		const session = await authClient.getSession();

		return { session: session.data };
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Bingy",
			},
			{
				name: "description",
				content:
					"Tired of losing track of what you're watching? Track your movies and shows with bingy, get notified about new releases, and discover what to watch next",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/favicon.ico",
			},
			{
				rel: "apple-touch-icon",
				href: "/logo192.png",
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
		],
	}),
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: GlobalError,
});

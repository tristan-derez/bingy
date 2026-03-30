import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { GlobalError } from "@/components/errors/global-error";
import { NotFoundComponent } from "@/components/errors/not-found";
import { RootComponent } from "@/components/root-component";
import { authClient } from "@/lib/auth-client";
import { sessionQueryOptions } from "@/lib/queries/session";
import { m } from "@/paraglide/messages";
import appCss from "@/styles/app.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
	authData?: ReturnType<typeof authClient.useSession>["data"];
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }) => {
		const authData =
			await context.queryClient.ensureQueryData(sessionQueryOptions);

		return { authData };
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
				content: m.head_app_description(),
			},
			{
				name: "theme-color",
				content: "#000000",
			},
			{
				name: "mobile-web-app-capable",
				content: "yes",
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover",
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
				href: "/apple-touch-icon.png",
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

import { TanstackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { GlobalError } from "@/components/errors/global-error";
import { NotFoundComponent } from "@/components/errors/not-found";
import Header from "@/components/Header";
import { LightRays } from "@/components/ui/light-rays";
import { authClient } from "@/lib/auth-client";
import appCss from "@/styles/app.css?url";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

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
	component: () => (
		<div>
			<HeadContent />
			<Header />
			<div className="pt-20 min-h-svh flex flex-col items-center py-22 lg:py-32 px-2 md:px-6 lg:px-12 2xl:px-32">
				<Outlet />
			</div>
			<TanstackDevtools
				config={{
					position: "bottom-left",
				}}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
					TanStackQueryDevtools,
				]}
			/>
			<LightRays />
		</div>
	),
	notFoundComponent: NotFoundComponent,
	errorComponent: GlobalError,
});

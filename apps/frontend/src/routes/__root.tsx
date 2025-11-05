import { TanstackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
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
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: () => (
		<div>
			<Header />
			<Outlet />
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

import { TanstackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { config } from "@/lib/env";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import Header from "./header";
import { GlobalLoadingIndicator } from "./loading/loading-global";
import { LightRays } from "./ui/light-rays";

export function RootComponent() {
	const isProd = config.appEnv === "production";

	return (
		<div>
			<HeadContent />
			<Header />
			<div className="pt-20 min-h-svh flex flex-col items-center py-22 lg:py-32 px-2 md:px-6 lg:px-12 2xl:px-32">
				<Outlet />
				<GlobalLoadingIndicator />
			</div>
			{!isProd ? (
				<TanstackDevtools
					config={{
						position: "top-left",
						hideUntilHover: true,
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
			) : null}
			<LightRays />
		</div>
	);
}

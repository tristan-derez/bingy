import { TanstackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { config } from "@/lib/env";
import { getLocale } from "@/paraglide/runtime";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import Header from "./header";
import { GlobalLoadingIndicator } from "./loading/loading-global";

export function RootComponent() {
	const isProd = config.appEnv === "production";
	useEffect(() => {
		document.documentElement.lang = getLocale();
	}, []);

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
		</div>
	);
}

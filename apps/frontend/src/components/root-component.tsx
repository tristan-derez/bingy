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
			<div className="flex flex-col items-center min-h-dvh py-20 lg:py-30 px-5 md:px-6 lg:px-28 xl:px-30 3xl:px-80">
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

import { TanstackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import Header from "./header-c";
import { LightRays } from "./ui/light-rays";

export function RootComponent() {
	return (
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
	);
}

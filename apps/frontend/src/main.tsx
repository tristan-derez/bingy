import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/components/theme/theme-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import {
	queryClient,
	Provider as TanStackQueryProvider,
} from "./integrations/tanstack-query/root-provider.tsx";
import reportWebVitals from "./reportWebVitals.ts";
import { routeTree } from "./routeTree.gen";
import "@/styles/app.css";
import "@/styles/autofill.css";

const router = createRouter({
	routeTree,
	context: {
		queryClient,
	},
	defaultPreload: false,
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<TanStackQueryProvider>
				<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
					<Toaster richColors position="bottom-center" />
					<RouterProvider router={router} />
				</ThemeProvider>
			</TanStackQueryProvider>
		</StrictMode>,
	);
}

reportWebVitals();

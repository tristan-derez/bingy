import { createFileRoute } from "@tanstack/react-router";
import { CenteredLayout } from "@/components/layout/centered-layout";
import logo from "../logo.svg";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<CenteredLayout>
			<img
				src={logo}
				className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
				alt="logo"
			/>
			<p>
				Edit <code>src/routes/index.tsx</code> and save to reload.
			</p>
			<a
				className="text-[#61dafb] hover:underline"
				href="https://reactjs.org"
				target="_blank"
				rel="noopener noreferrer"
			>
				Learn React
			</a>
			<a
				className="text-[#61dafb] hover:underline"
				href="https://tanstack.com"
				target="_blank"
				rel="noopener noreferrer"
			>
				Learn TanStack
			</a>
		</CenteredLayout>
	);
}

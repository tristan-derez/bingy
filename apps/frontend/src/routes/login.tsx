import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<p>hello from /login</p>
		</div>
	);
}

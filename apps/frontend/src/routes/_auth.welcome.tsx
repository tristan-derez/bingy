import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/hooks/session";

export const Route = createFileRoute("/_auth/welcome")({
	component: Welcome,
});

function Welcome() {
	const { data: session, isLoading } = useSession();

	if (isLoading) return <p>Loading...</p>;
	if (!session) return <p>No session</p>;

	if (!session.user.emailVerified) {
		return (
			<div>
				<p>Please verify your email.</p>
			</div>
		);
	}

	return <p>Welcome, {session.user.name}</p>;
}

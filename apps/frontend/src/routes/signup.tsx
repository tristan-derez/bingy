import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignUpForm } from "@/components/auth/forms/signup-form";

export const Route = createFileRoute("/signup")({
	beforeLoad: async ({ context }) => {
		if (context.session?.user) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: SignUpPage,
});

function SignUpPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<SignUpForm />
		</div>
	);
}

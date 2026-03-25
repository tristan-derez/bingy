import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignUpForm } from "@/components/auth/forms/signup-form";

export const Route = createFileRoute("/signup")({
	beforeLoad: async ({ context }) => {
		if (context.authData?.user) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: SignUpPage,
});

function SignUpPage() {
	return (
		<div className="flex w-full flex-1 justify-center items-center">
			<SignUpForm />
		</div>
	);
}

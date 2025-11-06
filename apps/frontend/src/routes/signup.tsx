import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignUpForm } from "@/components/auth/forms/signup-form";
import { CenteredLayout } from "@/components/layout/centered-layout";

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
		<CenteredLayout>
			<SignUpForm />
		</CenteredLayout>
	);
}

import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "@/components/signup-form";

export const Route = createFileRoute("/signup")({
	component: SignUpPage,
});

function SignUpPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<SignUpForm />
		</div>
	);
}

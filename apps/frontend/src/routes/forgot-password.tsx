import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ForgotPasswordForm } from "@/components/auth/forms/forgot-password-form";

const searchSchema = z.object({
	email: z.email().optional(),
});

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPasswordPage,
	validateSearch: searchSchema,
});

function ForgotPasswordPage() {
	const { email } = Route.useSearch();

	return (
		<div>
			<ForgotPasswordForm email={email} />
		</div>
	);
}

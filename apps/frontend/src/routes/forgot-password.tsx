import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ForgotPasswordForm } from "@/components/auth/forms/forgot-password-form";
import { CenteredLayout } from "@/components/layout/centered-layout";

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
		<CenteredLayout>
			<ForgotPasswordForm email={email} />
		</CenteredLayout>
	);
}

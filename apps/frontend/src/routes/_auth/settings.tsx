import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { SettingsComponent } from "@/components/auth/settings-component";
import { authClient } from "@/lib/auth-client";
import { m } from "@/paraglide/messages";

const settingsPageSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute("/_auth/settings")({
	head: () => ({
		meta: [{ title: "Bingy - Settings" }],
	}),
	validateSearch: settingsPageSchema,
	component: SettingsPage,
});

function SettingsPage() {
	const { data } = useSuspenseQuery({
		queryKey: ["accounts"],
		queryFn: async () => {
			const result = await authClient.listAccounts();
			return result.data;
		},
	});

	const error = useSearch({
		from: "/_auth/settings",
		select: (search) => search.error,
	});

	const errorMessages: Record<string, string> = {
		email_doesn_match: m.toast_error_email_doesnt_match_settings_page(),
		account_already_linked_to_different_user:
			m.toast_error_already_linked_settings_page(),
	};

	if (error) {
		const message =
			errorMessages[error] ?? m.toast_error_generic_error_settings_page();
		toast.error(message, {
			id: `error-${error}`,
			duration: Infinity,
			closeButton: true,
		});
	}

	return (
		<div className="flex w-full max-w-md flex-col gap-6">
			<SettingsComponent accounts={data} />
		</div>
	);
}

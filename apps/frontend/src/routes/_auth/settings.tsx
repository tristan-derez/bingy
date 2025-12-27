import { createFileRoute, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { SettingsComponent } from "@/components/auth/settings-component";
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
	const error = useSearch({
		from: "/_auth/settings",
		select: (search) => search.error,
	});

	// should not happen as allowDifferentEmail is activated in auth config
	if (error === "email_doesn't_match") {
		toast.error(m.toast_error_email_doesnt_match_settings_page(), {
			id: "email-doesnt-match-toast",
			duration: Infinity,
			closeButton: true,
		});
	}

	if (error === "account_already_linked_to_different_user") {
		toast.error(m.toast_error_already_linked_settings_page(), {
			id: "account_already_linked_toast",
			duration: Infinity,
			closeButton: true,
		});
	}

	if (error) {
		toast.error(m.toast_error_generic_error_settings_page(), {
			id: "oauth_generic_error_settings",
			duration: Infinity,
			closeButton: true,
		});
	}

	return (
		<div className="flex w-full max-w-md flex-col gap-6">
			<SettingsComponent />
		</div>
	);
}

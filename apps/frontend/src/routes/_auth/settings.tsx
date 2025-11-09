import { createFileRoute, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { SettingsComponent } from "@/components/auth/settings-component";
import { authClient } from "@/lib/auth-client";

const settingsPageSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute("/_auth/settings")({
	head: () => ({
		meta: [
			{
				title: "Bingy - Settings",
			},
		],
	}),
	validateSearch: settingsPageSchema,
	component: SettingsPage,
	beforeLoad: async () => {
		const connections = await authClient.listAccounts();
		return { connections };
	},
});

function SettingsPage() {
	const error = useSearch({
		from: "/_auth/settings",
		select: (search) => search.error,
	});

	if (error === "email_doesn't_match") {
		toast.error("Email doesn't match", {
			id: "email-doesnt-match-toast",
			duration: Infinity,
		})
	}

	return (
		<div className="flex w-full max-w-md flex-col gap-6">
			<SettingsComponent />
		</div>
	)
}

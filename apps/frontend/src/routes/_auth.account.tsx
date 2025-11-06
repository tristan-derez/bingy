import { createFileRoute, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { AccountComponent } from "@/components/auth/account-component";
import { authClient } from "@/lib/auth-client";

const accountPageSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute("/_auth/account")({
	validateSearch: accountPageSchema,
	component: AccountPage,
	beforeLoad: async () => {
		const connections = await authClient.listAccounts();
		return { connections };
	},
});

function AccountPage() {
	const error = useSearch({
		from: "/_auth/account",
		select: (search) => search.error,
	});

	if (error === "email_doesn't_match") {
		toast.error("Email doesn't match", {
			id: "email-doesnt-match-toast",
			duration: Infinity,
		});
	}

	return (
		<div>
			<AccountComponent />
		</div>
	);
}

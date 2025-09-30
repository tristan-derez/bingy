import { createFileRoute } from "@tanstack/react-router";
import { AccountComponent } from "@/components/auth/account-component";

export const Route = createFileRoute("/_auth/account")({
	component: AccountPage,
});

function AccountPage() {
	return (
		<div className="min-h-svh flex flex-col items-center justify-center px-4 space-y-6">
			<AccountComponent />
		</div>
	);
}

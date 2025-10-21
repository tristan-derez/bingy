import { useRouteContext } from "@tanstack/react-router";
import { UpdatePasswordForm } from "@/components/auth/forms/update-password-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { DeleteAccountTrigger } from "./delete-account";
import { DisableTwoFactorForm } from "./forms/disable-two-factor-form";
import { EnableTwoFactorForm } from "./forms/enable-two-factor-form";
import { UpdateEmailForm } from "./forms/update-email-form";
import { LinkAccountComponent } from "./link-account";

export function AccountComponent() {
	const { connections } = useRouteContext({ from: "/_auth/account" });
	const { session } = useRouteContext({ from: "__root__" });

	const googleConnected = connections?.data?.some(
		(c) => c.providerId === "google",
	);

	const twoFactorEnabled = session?.user?.twoFactorEnabled;

	return (
		<Card className="mx-auto mt-24 max-w-sm sm:min-w-[320px] md:min-w-[420px] p-4">
			<CardTitle>Edit account</CardTitle>
			<CardDescription>
				Make changes to your account informations here.
			</CardDescription>
			<Separator />
			<LinkAccountComponent />
			<Separator />
			{!googleConnected && !twoFactorEnabled && (
				<>
					<EnableTwoFactorForm />
					<Separator />
				</>
			)}
			{twoFactorEnabled && (
				<>
					<DisableTwoFactorForm />
					<Separator />
				</>
			)}
			<UpdateEmailForm />
			<Separator />
			<UpdatePasswordForm />
			<Separator />
			<DeleteAccountTrigger />
		</Card>
	);
}

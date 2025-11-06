import { useRouteContext } from "@tanstack/react-router";
import { UpdatePasswordForm } from "@/components/auth/forms/update-password-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "../theme/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DeleteAccountForm } from "./forms/delete-account-form";
import { DisableTwoFactorForm } from "./forms/disable-two-factor-form";
import { EnableTwoFactorForm } from "./forms/enable-two-factor-form";
import { UpdateEmailForm } from "./forms/update-email-form";
import { LinkAccountComponent } from "./link-account";

export function SettingsComponent() {
	const { connections } = useRouteContext({ from: "/_auth/settings" });
	const { session } = useRouteContext({ from: "__root__" });

	const hasPassword = connections?.data?.some(
		(c) => c.providerId === "credential",
	);

	const twoFactorEnabled = session?.user?.twoFactorEnabled;

	return (
		<Tabs defaultValue="account">
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="display">Display</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<Card className="p-4">
					<CardTitle>Edit account</CardTitle>
					<CardDescription>
						Manage your email, password, and security settings.
					</CardDescription>
					<Separator />
					<LinkAccountComponent />
					<Separator />
					{hasPassword && !twoFactorEnabled && (
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
					<DeleteAccountForm />
				</Card>
			</TabsContent>
			<TabsContent value="display">
				<Card className="max-w-sm sm:min-w-[320px] md:min-w-[420px] p-4">
					<CardTitle>Theme</CardTitle>
					<CardDescription>Select your preferred theme</CardDescription>
					<div className="flex flex-col py-2">
						<ModeToggle />
						<p></p>
					</div>
				</Card>
			</TabsContent>
		</Tabs>
	);
}

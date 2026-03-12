import { useRouteContext } from "@tanstack/react-router";
import type { Account } from "better-auth";
import { UpdatePasswordForm } from "@/components/auth/forms/update-password-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { m } from "@/paraglide/messages";
import { ModeToggle } from "../theme/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DeleteAccountForm } from "./forms/delete-account-form";
import { DisableTwoFactorForm } from "./forms/disable-two-factor-form";
import { EnableTwoFactorForm } from "./forms/enable-two-factor-form";
import { UpdateEmailForm } from "./forms/update-email-form";
import { LinkAccountComponent } from "./link-account";

type SettingsComponentProps = {
	accounts: Account[];
};

export function SettingsComponent({ accounts }: SettingsComponentProps) {
	const { authData } = useRouteContext({ from: "__root__" });

	if (!authData) {
		return null;
	}

	const hasPassword = accounts.some((c) => c.providerId === "credential");
	const twoFactorEnabled = authData.user.twoFactorEnabled;

	return (
		<Tabs defaultValue="account">
			<TabsList>
				<TabsTrigger value="account">
					{m.settings_tabs_trigger_account()}
				</TabsTrigger>
				<TabsTrigger value="display">
					{m.settings_tab_trigger_display()}
				</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<Card className="p-4">
					<CardTitle>{m.settings_card_title_account()}</CardTitle>
					<CardDescription>{m.settings_card_desc_account()}</CardDescription>
					<Separator />
					<LinkAccountComponent accounts={accounts} />
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
					<UpdatePasswordForm hasPassword={hasPassword} />
					<Separator />
					<DeleteAccountForm />
				</Card>
			</TabsContent>
			<TabsContent value="display">
				<Card className="max-w-sm sm:min-w-[320px] md:min-w-[420px] p-4">
					<CardTitle>{m.settings_card_title_display()}</CardTitle>
					<CardDescription>{m.settings_card_desc_display()}</CardDescription>
					<div className="flex flex-col py-2">
						<ModeToggle />
						<p></p>
					</div>
				</Card>
			</TabsContent>
		</Tabs>
	);
}

import { IconBrandGoogle } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import type { Account } from "better-auth";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";
import { m } from "@/paraglide/messages";
import { OAuthButton } from "../ui/oauth-button";

type LinkAccountComponentProps = {
	accounts: Account[];
};

export function LinkAccountComponent({ accounts }: LinkAccountComponentProps) {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const googleConnected = accounts.some((c) => c.providerId === "google");

	const getButtonText = () => {
		if (isLoading) {
			return googleConnected
				? m.btn_unlinking_account()
				: m.btn_linking_account();
		}

		return googleConnected
			? m.btn_unlink_account({ provider: "Google" })
			: m.btn_link_account({ provider: "Google" });
	};

	const handleLinkAccount = async (provider: "google") => {
		try {
			setIsLoading(true);

			if (googleConnected) {
				if (accounts.length <= 1) {
					toast.error(m.toast_error_unlink_account({ provider: "Google" }));
					return;
				}

				await authClient.unlinkAccount({ providerId: provider });
				toast.success(m.toast_success_unlink_account({ provider: "Google" }));
				navigate({ to: "/settings" });
			} else {
				await authClient.linkSocial({
					provider,
					callbackURL: `${config.appUrl}/settings`,
					errorCallbackURL: `${config.appUrl}/settings`,
				});
			}
		} catch (err) {
			toast.error(m.toast_error_generic());
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="grid gap-2">
			<div>
				{googleConnected ? (
					<>
						<p className="text-md font-semibold leading-none tracking-tight">
							{m.unlink_account_title()}
						</p>
						<p className="text-sm text-muted-foreground mt-1.5">
							{m.unlink_account_desc()}
						</p>
					</>
				) : (
					<>
						<p className="text-md font-semibold leading-none tracking-tight">
							{m.link_account_title()}
						</p>
						<p className="text-sm text-muted-foreground mt-1.5">
							{m.link_account_desc()}
						</p>
					</>
				)}
			</div>

			<OAuthButton
				icon={IconBrandGoogle}
				label="Google"
				text={getButtonText()}
				onClick={() => handleLinkAccount("google")}
				disabled={isLoading}
			/>
		</div>
	);
}

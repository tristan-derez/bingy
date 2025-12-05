import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";
import { m } from "@/paraglide/messages";
import { OAuthButton } from "../ui/oauth-button";

export function LinkAccountComponent() {
	const { connections } = useRouteContext({ from: "/_auth/settings" });
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const googleConnected = connections?.data?.some(
		(c) => c.providerId === "google",
	);

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
				if ((connections?.data?.length ?? 0) <= 1) {
					toast.error(m.toast_error_unlink_account());
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
				// errors comes from the url in the settings route, thats where we call a toast
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
				icon={FcGoogle}
				label="Google"
				text={getButtonText()}
				onClick={() => handleLinkAccount("google")}
				disabled={isLoading}
			/>
		</div>
	);
}

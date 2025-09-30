import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { OAuthButton } from "../ui/oauth-button";

export function LinkAccountComponent() {
	const { connections } = useRouteContext({ from: "/_auth/account" });
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const googleConnected = connections?.data?.some(
		(c) => c.providerId === "google",
	);

	const getButtonText = () => {
		if (isLoading) {
			return googleConnected ? "Unlinking..." : "Linking...";
		}
		return googleConnected ? "Unlink Google" : "Link to Google";
	};

	const handleLinkAccount = async (provider: "google") => {
		try {
			setIsLoading(true);

			if (googleConnected) {
				if ((connections?.data?.length ?? 0) <= 1) {
					toast.error("You cannot unlink your only account.");
					return;
				}

				await authClient.unlinkAccount({ providerId: provider });
				toast.success("Google account unlinked.");
				navigate({ to: "/account" });
			} else {
				await authClient.linkSocial({
					provider,
					callbackURL: "http://localhost:5173/account",
					errorCallbackURL: "http://localhost:5173/account",
				});
			}
		} catch (err) {
			toast.error(
				err instanceof Error
					? err.message
					: "Something went wrong. Try again later.",
			);
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
							Linked accounts
						</p>
						<p className="text-sm text-muted-foreground mt-1.5">
							Feel free to unlink accounts, but make sure you always have at
							least one way to sign in.
						</p>
					</>
				) : (
					<>
						<p className="text-md font-semibold leading-none tracking-tight">
							Link accounts
						</p>
						<p className="text-sm text-muted-foreground mt-1.5">
							Link your account to a provider.
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

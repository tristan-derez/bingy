import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/integrations/tanstack-query/root-provider";
import { authClient } from "@/lib/auth-client";
import { sessionQueryOptions } from "@/lib/queries/session";
import { m } from "@/paraglide/messages";
import { twoFactorSchema } from "@/schemas/two-factor-schema";
import { SetupTwoFactorDialog } from "../setup-two-factor-dialog";

export function EnableTwoFactorForm() {
	const { session } = useRouteContext({ from: "__root__" });
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	const [totpUri, setTotpUri] = useState("");
	const id = useId();

	const form = useForm<z.infer<typeof twoFactorSchema>>({
		resolver: zodResolver(twoFactorSchema),
		defaultValues: {
			password: "",
		},
	});

	const onFormSubmit: SubmitHandler<z.infer<typeof twoFactorSchema>> = async (
		formData,
	) => {
		setIsSubmitting(true);
		try {
			const { data: enableData, error: enableError } =
				await authClient.twoFactor.enable({
					password: formData.password,
				});

			if (enableError) {
				toast.error(enableError.message || m.toast_error_enable_twofactor());
				return;
			}

			if (enableData) {
				const { data: totpData, error: totpError } =
					await authClient.twoFactor.getTotpUri({
						password: formData.password,
					});

				if (totpError) {
					toast.error(totpError.message || m.toast_error_invalid_code());
					return;
				}

				if (totpData?.totpURI) {
					setTotpUri(totpData.totpURI);
					setShowDialog(true);
				}
			}
		} catch (err) {
			toast.error(m.toast_error_generic());
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerify = async (code: string) => {
		try {
			const { data, error } = await authClient.twoFactor.verifyTotp({
				code,
				trustDevice: true,
			});

			if (error?.message === "Invalid two factor cookie") {
				toast.error(m.toast_error_invalid_code());
				return;
			} else if (error) {
				toast.error(error.message);
				return;
			}

			if (data) {
				const { data: freshSession } = await authClient.getSession({
					query: { disableCookieCache: true },
				});
				queryClient.setQueryData(sessionQueryOptions.queryKey, freshSession);

				toast.success(m.toast_success_enable_twofactor());
				setShowDialog(false);
				form.reset();
				router.navigate({ to: "/settings" });
			}
		} catch (err) {
			toast.error(m.toast_error_generic());
		}
	};

	return (
		<>
			<div className="grid gap-2">
				<div>
					<p className="text-md font-semibold leading-none tracking-tight">
						{m.two_factor_title()}
					</p>
					<p className="text-sm text-muted-foreground mt-1.5">
						{m.two_factor_enable_short_desc()}
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onFormSubmit)}
						className="grid gap-4"
					>
						<fieldset disabled={isSubmitting}>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel htmlFor={`${id}-password`}>
											{m.form_password_label()}
										</FormLabel>
										<FormControl>
											<Input
												id={`${id}-password`}
												type="password"
												autoComplete="current-password"
												required
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								disabled={!session?.user?.emailVerified}
								className="w-full mt-4 disabled:bg-gray-300 disabled:text-gray-500"
							>
								{isSubmitting ? (
									<span className="flex items-center justify-center gap-2">
										<Loader2 className="animate-spin h-4 w-4" />
										{m.btn_enabling_two_factor()}
									</span>
								) : (
									m.btn_enable_two_factor()
								)}
							</Button>
							{!session?.user?.emailVerified && (
								<p className="text-sm text-gray-500 mt-2">
									{m.email_not_verified()}
								</p>
							)}
						</fieldset>
					</form>
				</Form>
			</div>
			<SetupTwoFactorDialog
				open={showDialog}
				onOpenChange={setShowDialog}
				totpUri={totpUri}
				onVerify={handleVerify}
			/>
		</>
	);
}

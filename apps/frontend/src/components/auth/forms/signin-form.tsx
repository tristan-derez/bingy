import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandGoogleFilled, IconLoader } from "@tabler/icons-react";
import { Link, useRouter } from "@tanstack/react-router";
import { useId, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MagicCard } from "@/components/ui/magic-card";
import { OAuthButton } from "@/components/ui/oauth-button";
import { SeparatorWithText } from "@/components/ui/separator-text";
import { queryClient } from "@/integrations/tanstack-query/root-provider";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";
import { sessionQueryOptions } from "@/lib/queries/session";
import { m } from "@/paraglide/messages";
import { signinFormSchema } from "@/schemas/signin-form-schema";
import { TwoFactorDialog } from "../two-factor.dialog";

export function SignInForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	const id = useId();
	const router = useRouter();
	const lastMethod = authClient.getLastUsedLoginMethod();

	const form = useForm<z.infer<typeof signinFormSchema>>({
		resolver: zodResolver(signinFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const watchedEmail = form.watch("email");

	const onFormSubmit: SubmitHandler<z.infer<typeof signinFormSchema>> = async (
		formData,
	) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await authClient.signIn.email({
				email: formData.email,
				password: formData.password,
			});

			if (data) {
				const user = data.user as typeof data.user & {
					twoFactorEnabled: boolean;
					displayName: string;
				};

				await queryClient.invalidateQueries({
					queryKey: sessionQueryOptions.queryKey,
				});
				await queryClient.refetchQueries({
					queryKey: sessionQueryOptions.queryKey,
				});

				if (user.twoFactorEnabled) {
					setShowDialog(true);
					return;
				}

				if (!data.user.emailVerified) {
					await router.navigate({ to: "/verify-email" });
					return;
				}

				await router.navigate({ to: "/dashboard" });
			}

			if (error) {
				if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
					toast.error("invalid email or password");
				} else {
					toast.error(m.toast_error_generic());
				}
			}
		} catch (err) {
			toast.error(m.toast_error_generic());
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOAuthSignIn = async (provider: "google") => {
		try {
			await authClient.signIn.social({
				provider,
				callbackURL: `${config.appUrl}/dashboard`,
				errorCallbackURL: `${config.appUrl}/signup`,
				newUserCallbackURL: `${config.appUrl}/welcome`,
			});
		} catch (err) {
			toast.error(m.toast_error_generic());
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerifyTotp = async (code: string) => {
		try {
			const { data, error } = await authClient.twoFactor.verifyTotp({
				code,
				trustDevice: true,
			});

			if (error?.message === "Invalid two factor cookie") {
				toast.error(m.toast_error_invalid_code());
				return;
			} else if (error) {
				toast.error(m.toast_error_generic());
				return;
			}

			if (data) {
				await queryClient.invalidateQueries({
					queryKey: sessionQueryOptions.queryKey,
				});
				await queryClient.refetchQueries({
					queryKey: sessionQueryOptions.queryKey,
				});

				toast.success(m.welcome_back_message({ username: data.user.name }));
				setShowDialog(false);
				form.reset();
				await router.navigate({ to: "/dashboard" });
			}
		} catch (err) {
			toast.error(m.toast_error_signin_invalid_code());
		}
	};

	return (
		<>
			<Card className="border-none shadow-transparent p-0">
				<MagicCard
					gradientColor="var(--shadow-pointer)"
					className="py-4 md:px-2 min-w-2xs md:min-w-md lg:min-w-lg"
				>
					<CardHeader>
						<CardTitle className="text-2xl">{m.signin_title()}</CardTitle>
						<CardDescription>
							<div className="flex flex-col gap-1">
								<p>{m.signin_desc_one()}</p>
								<p>{m.signin_desc_two()}</p>
							</div>
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 pt-2">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onFormSubmit)}
								className="grid gap-4"
							>
								<fieldset disabled={isSubmitting}>
									<div className="grid gap-4">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem className="grid gap-2">
													<FormLabel htmlFor={`${id}-email`}>
														{m.form_email_label()}
													</FormLabel>
													<FormControl>
														<Input
															id={`${id}-email`}
															type="email"
															autoComplete="email"
															placeholder="m@example.com"
															required
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem className="grid gap-2">
													<div className="flex items-center">
														<FormLabel htmlFor={`${id}-password`}>
															{m.form_password_label()}
														</FormLabel>
														<Link
															to={"/forgot-password"}
															search={
																watchedEmail
																	? { email: watchedEmail }
																	: undefined
															}
															className="ml-auto inline-block text-xs underline"
														>
															{m.signin_forgot_password()}
														</Link>
													</div>
													<Input
														id={`${id}-password`}
														type="password"
														autoComplete="current-password"
														{...field}
													/>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											type="submit"
											className="w-full mt-2 font-bold flex justify-center relative disabled:bg-gray-300 disabled:text-gray-500"
										>
											{isSubmitting ? (
												<span className="flex items-center justify-center gap-2">
													<IconLoader className="animate-spin h-4 w-4" />
													{m.btn_signing_in()}
												</span>
											) : (
												m.btn_signin()
											)}
											{lastMethod === "email" ? (
												<Badge
													variant="secondary"
													className="hidden absolute right-2 rounded-md md:block text-xs overflow-hidden"
												>
													{m.signin_last_method_badge()}
												</Badge>
											) : null}
										</Button>
									</div>
								</fieldset>
							</form>
						</Form>

						<SeparatorWithText text={m.signin_separator_text()} />
						<div className="flex gap-2">
							<OAuthButton
								icon={IconBrandGoogleFilled}
								label={m.signin_with_provider({ provider: "Google" })}
								text="Google"
								lastMethod={lastMethod === "google"}
								onClick={() => handleOAuthSignIn("google")}
							/>
						</div>
						<div className="flex justify-center text-sm gap-1">
							<span>{m.signin_no_account()}</span>
							<Link to="/signup" className="underline">
								{m.signin_no_account_link()}
							</Link>
						</div>
					</CardContent>
				</MagicCard>
			</Card>

			<TwoFactorDialog
				open={showDialog}
				onOpenChange={setShowDialog}
				onVerify={handleVerifyTotp}
			/>
		</>
	);
}

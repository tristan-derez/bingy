import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconBrandGoogleFilled,
	IconInfoCircle,
	IconLoader,
} from "@tabler/icons-react";
import { Link, useRouter } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "@/components/toast/toast";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MagicCard } from "@/components/ui/magic-card";
import { OAuthButton } from "@/components/ui/oauth-button";
import { SeparatorWithText } from "@/components/ui/separator-text";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { queryClient } from "@/integrations/tanstack-query/root-provider";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";
import { sessionQueryOptions } from "@/lib/queries/session";
import { m } from "@/paraglide/messages";
import { signUpFormSchema } from "@/schemas/signup-form-schema";
import { getRandomAvatarUrl } from "@/utils/image";
import { capitalize } from "@/utils/utils";

export function SignUpForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const id = useId();

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		mode: "onTouched",
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onFormSubmit: SubmitHandler<z.infer<typeof signUpFormSchema>> = async (
		formData,
	) => {
		try {
			setIsSubmitting(true);

			const { data, error } = await authClient.signUp.email({
				email: formData.email,
				password: formData.password,
				name: formData.name,
				image: getRandomAvatarUrl(formData.name),
				callbackURL: `${config.appUrl}/verify-email`,
			});

			if (error) {
				switch (error.code) {
					case "USER_ALREADY_EXISTS":
					case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
						toast.error({ title: m.toast_error_duplicate_email() });
						break;
					case "USERNAME_ALREADY_EXISTS":
						toast.error({ title: m.toast_error_duplicate_username() });
						break;
					default:
						toast.error({ title: m.toast_error_generic() });
				}
				return;
			}

			if (!data) return;

			if (data.user) {
				await queryClient.invalidateQueries({
					queryKey: sessionQueryOptions.queryKey,
				});
				await queryClient.refetchQueries({
					queryKey: sessionQueryOptions.queryKey,
				});

				toast.success({
					title: m.toast_success_signup_verify_email({
						email: data.user.email,
					}),
				});
				await router.navigate({ to: "/verify-email" });
			}
		} catch (err) {
			toast.error({ title: m.toast_error_generic() });
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOAuthRegister = async (provider: "google") => {
		const providerCapitalized = capitalize(provider);
		try {
			toast.loading({
				title: m.toast_loading_redirect_to_provider({
					provider: providerCapitalized,
				}),
			});

			await authClient.signIn.social({
				provider,
				callbackURL: `${config.appUrl}/dashboard`,
				errorCallbackURL: `${config.appUrl}/signup`,
				newUserCallbackURL: `${config.appUrl}/welcome`,
			});
		} catch (err: unknown) {
			toast.error({
				title: m.toast_error_oauth_provider_generic({
					provider: providerCapitalized,
				}),
			});
		}
	};

	const isRegistering = isSubmitting;

	return (
		<Card className="border-none p-0 w-full max-w-lg">
			<MagicCard
				gradientColor="var(--shadow-pointer)"
				className="py-4 md:px-2 w-full max-w-lg"
			>
				<CardHeader>
					<CardTitle className="text-2xl">{m.signup_title()}</CardTitle>
					<CardDescription>
						<p>{m.signup_desc_one()}</p>
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 pt-2">
					<form
						onSubmit={form.handleSubmit(onFormSubmit)}
						className="grid gap-4"
					>
						<fieldset disabled={isRegistering}>
							<div className="grid gap-4">
								<Controller
									control={form.control}
									name="name"
									render={({ field }) => (
										<Field className="grid gap-2">
											<div className="flex items-center">
												<FieldLabel htmlFor={`${id}-username`}>
													{m.signup_username_label()}
												</FieldLabel>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger className="ml-2">
															<IconInfoCircle className="h-4 w-4" />
														</TooltipTrigger>
														<TooltipContent>
															<p>{m.signup_username_tooltip()}</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
											<FieldContent>
												<Input
													id={`${id}-username`}
													type="text"
													autoComplete="username"
													placeholder="Teemo"
													required
													{...field}
												/>
											</FieldContent>
											<FieldError />
										</Field>
									)}
								/>
								<Controller
									control={form.control}
									name="email"
									render={({ field }) => (
										<Field className="grid gap-2">
											<FieldLabel htmlFor={`${id}-email`}>
												{m.form_email_label()}
											</FieldLabel>
											<FieldContent>
												<Input
													id={`${id}-email`}
													type="email"
													autoComplete="email"
													placeholder="m@example.com"
													required
													{...field}
												/>
											</FieldContent>
											<FieldError />
										</Field>
									)}
								/>
								<Controller
									control={form.control}
									name="password"
									render={({ field }) => (
										<Field className="grid gap-2">
											<div className="flex items-center">
												<FieldLabel htmlFor={`${id}-password`}>
													{m.form_password_label()}
												</FieldLabel>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger className="ml-2">
															<IconInfoCircle className="h-4 w-4" />
														</TooltipTrigger>
														<TooltipContent>
															{m.signup_password_tooltip()}
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
											<FieldContent>
												<Input
													id={`${id}-password`}
													type="password"
													autoComplete="new-password"
													minLength={8}
													required
													{...field}
												/>
											</FieldContent>
											<FieldError />
										</Field>
									)}
								/>

								<Button
									type="submit"
									className="w-full mt-2 disabled:bg-gray-300 disabled:text-gray-500"
								>
									{isRegistering ? (
										<span className="flex items-center justify-center gap-2">
											<IconLoader className="animate-spin h-4 w-4" />
											{m.btn_registering_signup()}
										</span>
									) : (
										m.btn_signup()
									)}
								</Button>
							</div>
						</fieldset>
					</form>
					<div className="grid gap-4">
						<SeparatorWithText text={m.signup_separator_text()} />
						<div className="flex gap-2">
							<OAuthButton
								icon={IconBrandGoogleFilled}
								label={m.signup_with_provider({ provider: "Google" })}
								text="Google"
								onClick={() => handleOAuthRegister("google")}
							/>
						</div>
					</div>
					<div className="flex gap-1 justify-center text-sm">
						<span>{m.signup_already_account()}</span>
						<Link to="/signin" className="underline">
							{m.signup_already_account_link()}
						</Link>
					</div>
				</CardContent>
			</MagicCard>
		</Card>
	);
}

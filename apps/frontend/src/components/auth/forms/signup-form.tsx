import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React, { useId } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaCircleInfo } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import type { z } from "zod";
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";
import { m } from "@/paraglide/messages";
import { signUpFormSchema } from "@/schemas/signup-form-schema";
import { getRandomAvatarUrl } from "@/utils/avatar-generator";

export function SignUpForm() {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const isLoading = useRouterState({ select: (s) => s.isLoading });
	const navigate = useNavigate();
	const id = useId();

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
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
				image: getRandomAvatarUrl(),
				callbackURL: `${config.appUrl}/welcome`,
			});

			if (data && data.user) {
				toast.success(`Please verify your email at ${data.user.email}`);
				navigate({ to: "/welcome" });
			}

			error && toast.error(m.toast_generic_error());
		} catch (err) {
			toast.error(m.toast_generic_error());
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOAuthRegister = async (provider: "google") => {
		try {
			toast.loading("Redirecting to Google...", { id: "oauth" });
			await authClient.signIn.social({
				provider,
				callbackURL: `${config.appUrl}/dashboard`,
				errorCallbackURL: `${config.appUrl}/signup`,
				newUserCallbackURL: `${config.appUrl}/welcome`,
			});
		} catch (err: unknown) {
			const message =
				err instanceof Error
					? err.message
					: "Something went wrong with Google sign-in. Please try again!";
			toast.error(message, { id: "oauth" });
		}
	};

	const isRegistering = isLoading || isSubmitting;

	return (
		<Card className="border-none p-0">
			<MagicCard
				gradientColor="var(--shadow-pointer)"
				className="py-4 md:px-2 min-w-sm md:min-w-md"
			>
				<CardHeader>
					<CardTitle className="text-2xl">{m.signup_title()}</CardTitle>
					<CardDescription>
						<p>{m.signup_desc_one()}</p>
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 pt-2">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onFormSubmit)}
							className="grid gap-4"
						>
							<fieldset disabled={isRegistering}>
								<div className="grid gap-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem className="grid gap-2">
												<div className="flex items-center">
													<FormLabel htmlFor={`${id}-username`}>
														{m.signup_username_label()}
													</FormLabel>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger className="ml-2">
																<FaCircleInfo className="w-4 h-4" />
															</TooltipTrigger>
															<TooltipContent>
																<p>{m.signup_username_tooltip()}</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>
												<FormControl>
													<Input
														id={`${id}-username`}
														type="text"
														autoComplete="username"
														placeholder="Jack Doe"
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
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger className="ml-2">
																<FaCircleInfo className="w-4 h-4" />
															</TooltipTrigger>
															<TooltipContent>
																{m.signup_password_tooltip()}
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>
												<Input
													id={`${id}-password`}
													type="password"
													autoComplete="new-password"
													minLength={8}
													required
													{...field}
												/>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type="submit"
										className="w-full mt-2 disabled:bg-gray-300 disabled:text-gray-500"
									>
										{isRegistering ? (
											<span className="flex items-center justify-center gap-2">
												<Loader2 className="animate-spin h-4 w-4" />
												{m.btn_registering_signup()}
											</span>
										) : (
											m.btn_signup()
										)}
									</Button>
								</div>
							</fieldset>
						</form>
					</Form>
					<div className="grid gap-4">
						<SeparatorWithText text={m.signup_separator_text()} />
						<div className="flex gap-2">
							<OAuthButton
								icon={FcGoogle}
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

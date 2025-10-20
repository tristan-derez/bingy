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
import { Label } from "@/components/ui/label";
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

			if (error) {
				toast.error(error.message || "Oops! Request failed, try again.");
			} else if (data?.user) {
				toast.success(`Please verify your email at ${data.user.email}`);
				navigate({ to: "/welcome" });
			}
		} catch (err) {
			console.error("Sign up error:", err);
			toast.error("Something went wrong. Please try again.");
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
			console.error("OAuth sign up error:", message);
		}
	};

	const isRegistering = isLoading || isSubmitting;

	return (
		<Card className="mx-auto max-w-sm min-w-[320px] md:min-w-[420px]">
			<CardHeader>
				<CardTitle className="text-2xl">Create an account</CardTitle>
				<CardDescription>
					<p>
						Track and organize your favorite movies and TV shows in one place.
						Sign up now, it's free!
					</p>
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
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
												<FormLabel htmlFor="username-input">Name</FormLabel>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger className="ml-2">
															<FaCircleInfo className="w-4 h-4" />
														</TooltipTrigger>
														<TooltipContent>
															<p>This is how you will be called by the app.</p>
															<p>
																Feel free to go with a pseudonym, your full
																name, or just your first name—totally up to you!
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
											<FormControl>
												<Input
													id={`${id}-username`}
													type="text"
													autoComplete="name"
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
											<FormLabel htmlFor="email">Email</FormLabel>
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
												<Label htmlFor="password">Password</Label>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger className="ml-2">
															<FaCircleInfo className="w-4 h-4" />
														</TooltipTrigger>
														<TooltipContent>
															<p>
																Your password should meet ONE of these
																requirements:
															</p>
															<div>
																<p>- 15 or more characters</p>
																<p>
																	- At least 8 characters with uppercase,
																	lowercase and a number
																</p>
															</div>
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
									className="w-full mt-2 disabled:bg-gray-300 disabled:text-gray-500 hover:cursor-pointer"
								>
									{isRegistering ? (
										<span className="flex items-center justify-center gap-2">
											<Loader2 className="animate-spin h-4 w-4" />
											Creating account
										</span>
									) : (
										"Sign up"
									)}
								</Button>
							</div>
						</fieldset>
					</form>
				</Form>
				<div className="grid gap-4">
					<SeparatorWithText text="Or continue with" />
					<div className="flex gap-2">
						<OAuthButton
							icon={FcGoogle}
							label="Sign up with Google"
							text="Google"
							onClick={() => handleOAuthRegister("google")}
						/>
					</div>
				</div>
				<div className="mt-4 text-center text-sm">
					Already have an account?{" "}
					<Link to="/signin" className="underline">
						Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}

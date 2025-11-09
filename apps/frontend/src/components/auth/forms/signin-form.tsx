import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
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
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";
import { signinFormSchema } from "@/schemas/signin-form-schema";
import { TwoFactorDialog } from "../two-factor.dialog";

export function SignInForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	const id = useId();
	const navigate = useNavigate();
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
			await authClient.signIn.email(
				{
					email: formData.email,
					password: formData.password,
				},
				{
					async onSuccess(context) {
						if (context.data.twoFactorRedirect) {
							setShowDialog(true);
						} else if (context.data.user.emailVerified === "false") {
							toast.success("Please verify your email");
							navigate({ to: "/welcome" });
						} else if (context.data.user.emailVerified) {
							navigate({ to: "/dashboard" });
						}
					},
					async onError(context) {
						toast.error(
							context.error.message || "Oops! Request failed, try again.",
						);
					},
				},
			);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message.includes("Failed to fetch")
						? "Something went wrong. Try again later."
						: err.message
					: "Something went wrong. Try again later.";

			toast.error(message);
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
			toast.error(
				err instanceof Error
					? err.message
					: "Something went wrong. Try again later.",
			);
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
				toast.error("Invalid code. Try again.");
				return;
			} else if (error) {
				toast.error(error.message);
				return;
			}

			if (data) {
				toast.success(`Welcome back, ${data.user.name}!`);
				setShowDialog(false);
				form.reset();
				navigate({ to: "/dashboard" });
			}
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Failed to verify code. Try again.";
			toast.error(message);
		}
	};

	return (
		<>
			<Card className="border-none shadow-transparent p-0">
				<MagicCard
					gradientColor="var(--shadow-pointer)"
					className="py-4 md:px-2 min-w-sm md:min-w-md"
				>
					<CardHeader>
						<CardTitle className="text-2xl">Sign in</CardTitle>
						<CardDescription>
							<p>
								Welcome back! Your entertainment hub is waiting. <br />
								Just sign in to get going.
							</p>
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
													<FormLabel htmlFor={`${id}-email`}>Email</FormLabel>
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
															Password
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
															Forgot your password?
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
													<Loader2 className="animate-spin h-4 w-4" />
													Signing in
												</span>
											) : (
												"Sign in"
											)}
											{lastMethod === "email" && (
												<Badge
													variant="secondary"
													className="absolute right-2 rounded-md"
												>
													Last used
												</Badge>
											)}
										</Button>
									</div>
								</fieldset>
							</form>
						</Form>

						<SeparatorWithText text="Or continue with" />
						<div className="flex gap-2">
							<OAuthButton
								icon={FcGoogle}
								label="Sign in with Google"
								text="Google"
								lastMethod={lastMethod === "google"}
								onClick={() => handleOAuthSignIn("google")}
							/>
						</div>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link to="/signup" className="underline">
								Sign up
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

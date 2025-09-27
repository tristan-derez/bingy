import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React, { useId } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
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
import { authClient } from "@/lib/auth-client";
import { signinFormSchema } from "@/schemas/signin-form-schema";

export function SignInForm() {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const id = useId();
	const navigate = useNavigate();

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

			if (error) {
				toast.error(error.message || "Oops! Request failed, try again.");
			}

			if (data?.user.emailVerified === false) {
				toast.success(`Please verify your email at ${data.user.email}`);
				navigate({ to: "/welcome" });
			} else if (data?.user.emailVerified) {
				navigate({ to: "/dashboard" });
			}
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
				callbackURL: "http://localhost:5173/welcome",
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

	return (
		<Card className="mx-auto max-w-sm min-w-[420px]">
			<CardHeader>
				<CardTitle className="text-2xl">Sign in</CardTitle>
				<CardDescription>
					<p>
						Welcome back! Your entertainment hub is waiting. <br />
						Just sign in to get going.
					</p>
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
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
												<Link
													to={"/forgot-password"}
													search={
														watchedEmail ? { email: watchedEmail } : undefined
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
									className="w-full mt-2 disabled:bg-gray-300 disabled:text-gray-500 hover:cursor-pointer"
								>
									{isSubmitting ? (
										<span className="flex items-center justify-center gap-2">
											<Loader2 className="animate-spin h-4 w-4" />
											Signing in
										</span>
									) : (
										"Sign in"
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
						label="Sign In with Google"
						text="Google"
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
		</Card>
	);
}

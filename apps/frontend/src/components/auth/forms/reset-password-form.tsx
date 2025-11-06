import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React, { useId } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
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
import { authClient } from "@/lib/auth-client";
import { resetPasswordFormSchema } from "@/schemas/password/reset-password-form-schema";

interface ResetPasswordFormProps {
	token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const id = useId();
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
		resolver: zodResolver(resetPasswordFormSchema),
		defaultValues: {
			newPassword: "",
		},
	});

	const onFormSubmit: SubmitHandler<
		z.infer<typeof resetPasswordFormSchema>
	> = async (formData) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await authClient.resetPassword({
				newPassword: formData.newPassword,
				token,
			});

			if (error) {
				toast.error(error.message || "Failed to reset password. Try again.");
			}

			if (data) {
				toast.success("Password reset successfully!");
				navigate({ to: "/signin" });
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

	return (
		<Card className="mx-auto max-w-sm min-w-[420px]">
			<CardHeader>
				<CardTitle className="text-2xl">Reset password</CardTitle>
				<CardDescription>
					<p>Enter your new password below.</p>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onFormSubmit)}
						className="grid gap-4"
					>
						<fieldset disabled={isSubmitting}>
							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel htmlFor="newPassword">New password</FormLabel>
										<FormControl>
											<Input
												id={`${id}-newPassword`}
												type="password"
												autoComplete="new-password"
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
								className="w-full mt-4 disabled:bg-gray-300 disabled:text-gray-500"
							>
								{isSubmitting ? (
									<span className="flex items-center justify-center gap-2">
										<Loader2 className="animate-spin h-4 w-4" />
										Resetting password...
									</span>
								) : (
									"Reset password"
								)}
							</Button>
						</fieldset>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

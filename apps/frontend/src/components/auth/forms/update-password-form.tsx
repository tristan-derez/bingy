import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useId } from "react";
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
import { authClient } from "@/lib/auth-client";
import { updatePasswordFormSchema } from "@/schemas/password/update-password";

export function UpdatePasswordForm() {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [_, setIsSuccess] = React.useState(false);
	const id = useId();

	const form = useForm<z.infer<typeof updatePasswordFormSchema>>({
		resolver: zodResolver(updatePasswordFormSchema),
		defaultValues: {
			newPassword: "",
			currentPassword: "",
		},
	});

	const onFormSubmit: SubmitHandler<
		z.infer<typeof updatePasswordFormSchema>
	> = async (formData) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await authClient.changePassword({
				newPassword: formData.newPassword,
				currentPassword: formData.currentPassword,
				revokeOtherSessions: true,
			});

			if (error) {
				toast.error(error.message || "Failed to reset password. Try again.");
				return;
			}

			if (data) {
				toast.success("Password reset successfully!");
				setIsSuccess(true);
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
		<div className="grid gap-2">
			<div>
				<p className="text-md font-semibold leading-none tracking-tight">
					Password
				</p>
				<p className="text-sm text-muted-foreground mt-1.5">
					If you created your account with the Google provider, please request a
					new password in the sign-in form
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onFormSubmit)}>
					<fieldset disabled={isSubmitting} className="grid gap-2">
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<FormLabel htmlFor="newPassword">Current password</FormLabel>
									<FormControl>
										<Input
											id={`${id}-currentPassword`}
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
							className="w-full mt-4 disabled:bg-gray-300 disabled:text-gray-500 hover:cursor-pointer"
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<Loader2 className="animate-spin h-4 w-4" />
									Updating password
								</span>
							) : (
								"Reset password"
							)}
						</Button>
					</fieldset>
				</form>
			</Form>
		</div>
	);
}

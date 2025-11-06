import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteContext } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React, { useId } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
	const { connections } = useRouteContext({ from: "/_auth/settings" });
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [_, setIsSuccess] = React.useState(false);
	const id = useId();

	const hasPassword = connections?.data?.some(
		(c) => c.providerId === "credential",
	);

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
					{!hasPassword
						? "Google accounts require password reset via the sign-in page."
						: "This will log you out of all other sessions."}
				</p>
			</div>
			{hasPassword && (
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button variant="default" className="mt-2">
							Update password
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>This will update your password</DialogTitle>
							<DialogDescription>
								Enter your current password and choose a new one. Your new
								password must be at least 8 characters long.
							</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onFormSubmit)}>
								<fieldset disabled={isSubmitting} className="grid gap-2">
									<FormField
										control={form.control}
										name="currentPassword"
										render={({ field }) => (
											<FormItem className="grid gap-2">
												<FormLabel htmlFor="newPassword">
													Current password
												</FormLabel>
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
												<FormLabel htmlFor="newPassword">
													New password
												</FormLabel>
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
												Updating password
											</span>
										) : (
											"Reset password"
										)}
									</Button>
								</fieldset>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

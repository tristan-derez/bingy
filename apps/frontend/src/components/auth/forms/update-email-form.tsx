import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteContext } from "@tanstack/react-router";
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
import { updateEmailSchema } from "@/schemas/update-email-schema";

export function UpdateEmailForm() {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const id = useId();
	const { user } = useRouteContext({ from: "/_auth" });

	const form = useForm<z.infer<typeof updateEmailSchema>>({
		resolver: zodResolver(updateEmailSchema),
		defaultValues: {
			newEmail: "",
		},
	});

	const onFormSubmit: SubmitHandler<z.infer<typeof updateEmailSchema>> = async (
		formData,
	) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await authClient.changeEmail({
				newEmail: formData.newEmail,
				callbackURL: "http://localhost:5173/account",
			});

			if (error) {
				toast.error(error.message || "Failed to change your email");
				return;
			}

			if (data) {
				if (data.status) {
					toast.success(
						`Verification email sent to ${formData.newEmail}. Please check your inbox.`,
					);
				} else {
					toast.success("Email changed successfully.");
				}
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
					Email
				</p>
				<p className="text-sm text-muted-foreground mt-1.5">
					{user.emailVerified
						? "A verification email will be sent to your current email to approve the change."
						: "Your email will be updated immediately as your current email isn't verified."}
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onFormSubmit)}>
					<fieldset disabled={isSubmitting} className="grid gap-2">
						<FormItem className="grid gap-2">
							<FormLabel htmlFor={`${id}-currentEmail`}>
								Current email
							</FormLabel>
							<FormControl>
								<Input
									id={`${id}-currentEmail`}
									type="email"
									value={user.email}
									disabled
									className="bg-muted"
								/>
							</FormControl>
						</FormItem>
						<FormField
							control={form.control}
							name="newEmail"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<FormLabel htmlFor="newPassword">New email</FormLabel>
									<FormControl>
										<Input
											id={`${id}-newEmail`}
											type="email"
											autoComplete="email"
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
									Updating email...
								</span>
							) : (
								"Update email"
							)}
						</Button>
					</fieldset>
				</form>
			</Form>
		</div>
	);
}

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
import { config } from "@/lib/env";
import { m } from "@/paraglide/messages";
import { forgotPasswordFormSchema } from "@/schemas/password/forgot-password-form-schema";

interface ForgotPasswordFormProps {
	email?: string;
}

export function ForgotPasswordForm({ email }: ForgotPasswordFormProps) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const id = useId();
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
		resolver: zodResolver(forgotPasswordFormSchema),
		defaultValues: {
			email: email || "",
		},
	});

	const onFormSubmit: SubmitHandler<
		z.infer<typeof forgotPasswordFormSchema>
	> = async (formData) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await authClient.requestPasswordReset({
				email: formData.email,
				redirectTo: `${config.appUrl}/reset-password`,
			});

			error && toast.error(m.email_not_send);

			if (data && data.status) {
				navigate({ to: "/signin" });
				toast.success(m.forgot_password_email_sent());
			}
		} catch (err) {
			toast.error(m.toast_error_generic());
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card className="mx-auto max-w-sm min-w-[420px]">
			<CardHeader>
				<CardTitle className="text-2xl">{m.forgot_password_title()}</CardTitle>
				<CardDescription>
					<p>{m.forgot_password_desc()}</p>
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
								name="email"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel htmlFor="email">
											{m.form_email_label()}
										</FormLabel>
										<FormControl>
											<Input
												id={`${id}-email`}
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
								className="w-full mt-4 disabled:bg-gray-300 disabled:text-gray-500"
							>
								{isSubmitting ? (
									<span className="flex items-center justify-center gap-2">
										<Loader2 className="animate-spin h-4 w-4" />
										{m.btn_sending_email()}
									</span>
								) : (
									m.forgot_password_title()
								)}
							</Button>
						</fieldset>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

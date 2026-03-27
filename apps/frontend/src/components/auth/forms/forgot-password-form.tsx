import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import React, { useId } from "react";
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
		mode: "onChange",
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

			error &&
				toast.error({
					title: m.toast_error_email_not_sent() ?? m.toast_error_generic(),
				});

			if (data && data.status) {
				navigate({ to: "/signin" });
				toast.success({ title: m.forgot_password_email_sent() });
			}
		} catch (err) {
			toast.error({ title: m.toast_error_generic() });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card className="border-none p-0">
			<MagicCard
				gradientColor="var(--shadow-pointer)"
				className="py-4 md:px-2 min-w-[300px] md:min-w-md lg:min-w-lg"
			>
				<CardHeader>
					<CardTitle className="text-2xl">
						{m.forgot_password_title()}
					</CardTitle>
					<CardDescription>
						<p>{m.forgot_password_desc()}</p>
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-2">
					<form
						onSubmit={form.handleSubmit(onFormSubmit)}
						className="grid gap-4"
						noValidate
					>
						<fieldset disabled={isSubmitting}>
							<Controller
								control={form.control}
								name="email"
								render={({ field, fieldState }) => (
									<Field className="grid gap-2">
										<FieldLabel htmlFor="email">
											{m.form_email_label()}
										</FieldLabel>
										<FieldContent>
											<Input
												id={`${id}-email`}
												type="email"
												autoComplete="email"
												{...field}
											/>
										</FieldContent>
										<FieldError
											errors={fieldState.error ? [fieldState.error] : undefined}
										/>
									</Field>
								)}
							/>
							<Button
								type="submit"
								className="w-full mt-4 disabled:bg-gray-300 disabled:text-gray-500"
							>
								{isSubmitting ? (
									<span className="flex items-center justify-center gap-2">
										<IconLoader className="animate-spin h-4 w-4" />
										{m.btn_sending_email()}
									</span>
								) : (
									m.forgot_password_title()
								)}
							</Button>
						</fieldset>
					</form>
				</CardContent>
			</MagicCard>
		</Card>
	);
}

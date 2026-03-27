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
import { authClient } from "@/lib/auth-client";
import { m } from "@/paraglide/messages";
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
			password: "",
		},
	});

	const onFormSubmit: SubmitHandler<
		z.infer<typeof resetPasswordFormSchema>
	> = async (formData) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await authClient.resetPassword({
				newPassword: formData.password,
				token,
			});

			error && toast.error({ title: m.toast_error_reset_password() });

			if (data) {
				toast.success({ title: m.toast_success_reset_password() });
				navigate({ to: "/signin" });
			}
		} catch (err) {
			toast.error({ title: m.toast_error_generic() });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card className="mx-auto max-w-sm min-w-[420px]">
			<CardHeader>
				<CardTitle className="text-2xl">{m.reset_password_title()}</CardTitle>
				<CardDescription>
					<p>{m.reset_password_desc()}</p>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onFormSubmit)} className="grid gap-4">
					<fieldset disabled={isSubmitting}>
						<Controller
							control={form.control}
							name="password"
							render={({ field, fieldState }) => (
								<Field className="grid gap-2">
									<FieldLabel htmlFor="password">
										{m.form_new_password_label()}
									</FieldLabel>
									<FieldContent>
										<Input
											id={`${id}-password`}
											type="password"
											autoComplete="new-password"
											required
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
									{m.btn_resetting_password()}
								</span>
							) : (
								m.btn_reset_password()
							)}
						</Button>
					</fieldset>
				</form>
			</CardContent>
		</Card>
	);
}

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

			error && toast.error(m.toast_error_reset_password());

			if (data) {
				toast.success(m.toast_success_reset_password());
				navigate({ to: "/signin" });
			}
		} catch (err) {
			toast.error(m.toast_generic_error());
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
										<FormLabel htmlFor="newPassword">
											{m.form_new_password_label()}
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
										{m.btn_resetting_password()}
									</span>
								) : (
									m.btn_reset_password()
								)}
							</Button>
						</fieldset>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

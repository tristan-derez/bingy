import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useId, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "@/components/toast/toast";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";
import { m } from "@/paraglide/messages";
import { deleteAccountSchema } from "@/schemas/delete-account-schema";

interface DeleteAccountFormProps {
	hasPassword: boolean;
}

export function DeleteAccountForm({ hasPassword }: DeleteAccountFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [open, setOpen] = useState(false);
	const id = useId();

	const schema = deleteAccountSchema(hasPassword);
	const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: { password: "" },
	});

	const onFormSubmit: SubmitHandler<
		z.infer<ReturnType<typeof deleteAccountSchema>>
	> = async (formData) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await authClient.deleteUser({
				...(hasPassword ? { password: formData.password } : {}),
				callbackURL: `${config.appUrl}/goodbye`,
			});

			if (data) {
				toast.success({ title: m.toast_email_sent_account_delete() });
				setOpen(false);
			}

			if (error) {
				if (error.code === "INVALID_PASSWORD") {
					toast.error({ title: m.toast_invalid_password_error() });
				} else {
					toast.error({ title: m.toast_error_generic() });
				}
			}
		} catch (err) {
			toast.error({ title: m.toast_error_generic() });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="grid gap-2">
			<p className="text-md font-semibold leading-none tracking-tight">
				{m.delete_account_title()}
			</p>
			<p className="text-sm text-muted-foreground mt-1.5">
				{m.delete_account_short_desc()}
			</p>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogTrigger
					render={
						<Button variant="destructive" className="mt-2 w-full">
							{m.delete_account_title()}
						</Button>
					}
				/>

				<AlertDialogContent className="max-w-lg!">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{m.dialog_delete_account_title()}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{m.dialog_delete_account_warning()}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4">
						{hasPassword ? (
							<Controller
								control={control}
								name="password"
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel htmlFor={`${id}-password`}>
											{m.form_password_label()}
										</FieldLabel>
										<Input
											id={`${id}-password`}
											type="password"
											autoComplete="current-password"
											{...field}
										/>
										<FieldError
											errors={fieldState.error ? [fieldState.error] : undefined}
										/>
									</Field>
								)}
							/>
						) : null}

						<AlertDialogFooter>
							<AlertDialogCancel>{m.dialog_cancel_action()}</AlertDialogCancel>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<span className="flex items-center justify-center gap-2">
										<IconLoader className="animate-spin h-4 w-4" />
										{m.btn_sending_email()}
									</span>
								) : (
									m.delete_account_title()
								)}
							</Button>
						</AlertDialogFooter>
					</form>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

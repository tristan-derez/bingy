import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import React, { useId } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
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
import { deleteAccountSchema } from "@/schemas/delete-account-schema";

export function DeleteAccountForm() {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const id = useId();

	const form = useForm<z.infer<typeof deleteAccountSchema>>({
		resolver: zodResolver(deleteAccountSchema),
		defaultValues: { password: "" },
	});

	const onFormSubmit: SubmitHandler<
		z.infer<typeof deleteAccountSchema>
	> = async (formData) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await authClient.deleteUser({
				password: formData.password,
				callbackURL: `${config.appUrl}/goodbye`,
			});

			if (data) {
				toast.success(m.toast_email_sent_account_delete());
				setOpen(false);
			}

			error && toast.error(m.toast_error_generic());
		} catch (err) {
			toast.error(m.toast_error_generic());
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
				<AlertDialogTrigger>
					<Button variant="destructive" className="mt-2 w-full">
						{m.delete_account_title()}
					</Button>
				</AlertDialogTrigger>

				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{m.dialog_delete_account_title()}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{m.dialog_delete_account_warning()}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onFormSubmit)}
							className="grid gap-4"
						>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="password">
											{m.form_password_label()}
										</FormLabel>
										<FormControl>
											<Input
												id={`${id}-password`}
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

							<AlertDialogFooter>
								<AlertDialogCancel>
									{m.dialog_cancel_action()}
								</AlertDialogCancel>
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
					</Form>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

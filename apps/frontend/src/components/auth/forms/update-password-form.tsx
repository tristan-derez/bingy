import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
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
import { m } from "@/paraglide/messages";
import { updatePasswordFormSchema } from "@/schemas/password/update-password";

type UpdatePasswordFormProps = {
	hasPassword: boolean;
};

export function UpdatePasswordForm({ hasPassword }: UpdatePasswordFormProps) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [open, setOpen] = React.useState(false);
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
				toast.error(m.toast_error_update_password());
				return;
			}

			if (data) {
				toast.success(m.toast_success_update_password());
				setIsSuccess(true);
			}
		} catch (err) {
			toast.error(m.toast_error_generic());
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="grid gap-2">
			<div>
				<p className="text-md font-semibold leading-none tracking-tight">
					{m.update_password_title()}
				</p>
				<p className="text-sm text-muted-foreground mt-1.5">
					{!hasPassword
						? m.update_password_desc_oauth({ providers: "Google" })
						: m.update_password_desc()}
				</p>
			</div>
			{hasPassword ? (
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger
						render={<Button>{m.btn_update_password()}</Button>}
						className="w-full"
					></DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{m.dialog_title_update_password()}</DialogTitle>
							<DialogDescription>
								{m.dialog_desc_update_password()}
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
												<FormLabel htmlFor="currentPassword">
													{m.form_current_password_label()}
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
												<IconLoader className="animate-spin h-4 w-4" />
												{m.btn_updating_password()}
											</span>
										) : (
											m.btn_update_password()
										)}
									</Button>
								</fieldset>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			) : null}
		</div>
	);
}

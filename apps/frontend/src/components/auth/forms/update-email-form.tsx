import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useRouteContext } from "@tanstack/react-router";
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
import { config } from "@/lib/env";
import { m } from "@/paraglide/messages";
import { updateEmailSchema } from "@/schemas/update-email-schema";

export function UpdateEmailForm() {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const id = useId();
	const { user } = useRouteContext({ from: "/_auth" });

	const form = useForm<z.infer<typeof updateEmailSchema>>({
		resolver: zodResolver(updateEmailSchema),
		defaultValues: {
			email: "",
		},
	});

	const onFormSubmit: SubmitHandler<z.infer<typeof updateEmailSchema>> = async (
		formData,
	) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await authClient.changeEmail({
				email: formData.email,
				callbackURL: `${config.appUrl}/account`,
			});

			if (error) {
				toast.error(m.toast_error_update_email());
				return;
			}

			if (data) {
				if (data.status) {
					toast.success(
						m.toast_success_update_email_confirmation_needed({
							userEmail: user.email,
						}),
					);
				} else {
					toast.success(m.toast_success_update_email());
				}
			}
		} catch (err) {
			toast.error(m.toast_error_generic());
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="flex flex-col gap-2">
				<p className="text-md font-semibold leading-none tracking-tight">
					{m.update_email_title()}
				</p>
				<p className="text-sm text-muted-foreground">
					{user.emailVerified
						? m.update_email_desc_email_verified()
						: m.update_email_desc()}
				</p>
			</div>
			<label
				htmlFor={`${id}-currentEmail`}
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{m.form_current_email_label()}
			</label>
			<Input
				id={`${id}-currentEmail`}
				type="email"
				value={user.email}
				disabled
				className="bg-muted"
			/>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger
					render={<Button>{m.btn_update_email()}</Button>}
					className="w-full"
				/>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{m.dialog_title_update_email()}</DialogTitle>
						<DialogDescription>
							{user.emailVerified
								? m.dialog_desc_update_email_verified()
								: m.dialog_desc_update_email()}
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onFormSubmit)}>
							<fieldset disabled={isSubmitting} className="grid gap-2">
								<FormItem className="grid gap-2">
									<FormLabel htmlFor={`${id}-currentEmail`}>
										{m.form_current_email_label()}
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
									name="email"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel htmlFor="email">
												{m.form_new_email_label()}
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
											<IconLoader className="animate-spin h-4 w-4" />
											{m.btn_updating_email()}
										</span>
									) : (
										m.btn_update_email()
									)}
								</Button>
							</fieldset>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

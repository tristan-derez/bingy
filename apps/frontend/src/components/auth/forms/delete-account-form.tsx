import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";
import { deleteAccountSchema } from "@/schemas/delete-account-schema";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";

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
				toast.success("An email has been sent to confirm account deletion.");
				setOpen(false);
			}

			if (error) {
				toast.error(error.message || "Oops! Request failed, try again.");
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Unexpected error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="grid gap-2">
			<p className="text-md font-semibold leading-none tracking-tight">
				Delete account
			</p>
			<p className="text-sm text-muted-foreground mt-1.5">
				This action is permanent. You’ll receive a confirmation email to
				complete the deletion.
			</p>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogTrigger asChild>
					<Button variant="destructive" className="mt-2">
						Delete Account
					</Button>
				</AlertDialogTrigger>

				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers. You'll receive a
							confirmation email with a link to complete the deletion. Your
							account will remain active until you confirm via email.
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
										<FormLabel htmlFor="password">Password</FormLabel>
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
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<span className="flex items-center justify-center gap-2">
											<Loader2 className="animate-spin h-4 w-4" />
											Sending confirmation email
										</span>
									) : (
										"Delete Account"
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

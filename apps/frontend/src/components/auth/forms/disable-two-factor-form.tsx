import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
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
import { m } from "@/paraglide/messages";
import { twoFactorSchema } from "@/schemas/two-factor-schema";

export function DisableTwoFactorForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const id = useId();

	const form = useForm<z.infer<typeof twoFactorSchema>>({
		resolver: zodResolver(twoFactorSchema),
		defaultValues: {
			password: "",
		},
	});

	const onFormSubmit: SubmitHandler<z.infer<typeof twoFactorSchema>> = async (
		formData,
	) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await authClient.twoFactor.disable({
				password: formData.password,
			});

			if (data) {
				toast.success(m.toast_success_disable_twofactor());
				navigate({ to: "/settings" });
			}

			error && toast.error(m.toast_error_disable_twofactor());
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
					{m.two_factor_title()}
				</p>
				<p className="text-sm text-muted-foreground mt-1.5">
					{m.btn_disable_twofactor()}
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onFormSubmit)} className="grid gap-4">
					<fieldset disabled={isSubmitting}>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<FormLabel htmlFor={`${id}-password`}>
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
						<Button
							type="submit"
							className="w-full mt-4 disabled:bg-gray-300 disabled:text-gray-500"
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<Loader2 className="animate-spin h-4 w-4" />
									{m.btn_disabling_twofactor()}
								</span>
							) : (
								m.btn_disable_twofactor()
							)}
						</Button>
					</fieldset>
				</form>
			</Form>
		</div>
	);
}

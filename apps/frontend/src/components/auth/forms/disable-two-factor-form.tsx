import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { toast } from "@/components/toast/toast";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/integrations/tanstack-query/root-provider";
import { authClient } from "@/lib/auth-client";
import { sessionQueryOptions } from "@/lib/queries/session";
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
				const { data: freshSession } = await authClient.getSession({
					query: { disableCookieCache: true },
				});
				queryClient.setQueryData(sessionQueryOptions.queryKey, freshSession);

				toast.success({ title: m.toast_success_disable_twofactor() });
				navigate({ to: "/settings" });
			}

			error && toast.error({ title: m.toast_error_disable_twofactor() });
		} catch (err) {
			toast.error({ title: m.toast_error_generic() });
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

			<form onSubmit={form.handleSubmit(onFormSubmit)} className="grid gap-4">
				<fieldset disabled={isSubmitting}>
					<Controller
						control={form.control}
						name="password"
						render={({ field }) => (
							<Field className="grid gap-2">
								<FieldLabel htmlFor={`${id}-password`}>
									{m.form_password_label()}
								</FieldLabel>
								<FieldContent>
									<Input
										id={`${id}-password`}
										type="password"
										autoComplete="current-password"
										required
										{...field}
									/>
								</FieldContent>
								<FieldError />
							</Field>
						)}
					/>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full mt-4 disabled:bg-gray-300 disabled:text-gray-500"
					>
						{isSubmitting ? (
							<span className="flex items-center justify-center gap-2">
								<IconLoader className="animate-spin h-4 w-4" />
								{m.btn_disabling_twofactor()}
							</span>
						) : (
							m.btn_disable_twofactor()
						)}
					</Button>
				</fieldset>
			</form>
		</div>
	);
}

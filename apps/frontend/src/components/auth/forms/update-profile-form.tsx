import { IconEdit, IconLocation } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Controller, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { m } from "@/paraglide/messages";
import { profileSchema } from "@/schemas/edit-profile-schema";

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface UpdateProfileFormProps {
	form: UseFormReturn<ProfileFormValues>;
	id: string;
	name: string;
}

export function UpdateProfileForm({ form, id, name }: UpdateProfileFormProps) {
	return (
		<div className="grid gap-4">
			<Field className="grid gap-2 hover:cursor-not-allowed">
				<FieldLabel htmlFor={`${id}-username`}>
					{m.form_username_label()}
				</FieldLabel>
				<FieldContent className="flex flex-row gap-2 items-center">
					<Input
						id={`${id}-username`}
						type="text"
						value={name}
						disabled
						readOnly
					/>
					<Link to="/settings">
						<Button>
							<IconEdit size={18} />
						</Button>
					</Link>
				</FieldContent>
			</Field>

			<Controller
				control={form.control}
				name="bio"
				render={({ field, fieldState }) => (
					<Field className="grid gap-2">
						<FieldLabel
							htmlFor={`${id}-bio`}
							className="flex flex-row justify-between"
						>
							{m.form_bio_label()}
							<p className="text-sm text-muted-foreground">
								{field.value.length}/160
							</p>
						</FieldLabel>
						<FieldContent>
							<Textarea
								id={`${id}-bio`}
								placeholder={m.form_bio_input_placeholder()}
								className="resize-none min-h-[100px]"
								maxLength={160}
								{...field}
							/>
						</FieldContent>
						{fieldState.error ? (
							<FieldError errors={[fieldState.error]} />
						) : null}
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="location"
				render={({ field, fieldState }) => (
					<Field className="grid gap-2">
						<FieldLabel
							htmlFor={`${id}-location`}
							className="flex flex-row justify-between"
						>
							{m.form_location_label()}
							<p className="text-sm text-muted-foreground">
								{field.value.length}/30
							</p>
						</FieldLabel>
						<FieldContent>
							<div className="relative">
								<IconLocation
									className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
									size={18}
								/>
								<Input
									id={`${id}-location`}
									type="text"
									placeholder="Bandle City"
									className="pl-10"
									{...field}
								/>
							</div>
						</FieldContent>
						{fieldState.error ? (
							<FieldError errors={[fieldState.error]} />
						) : null}
					</Field>
				)}
			/>
		</div>
	);
}

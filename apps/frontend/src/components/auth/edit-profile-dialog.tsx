import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteContext } from "@tanstack/react-router";
import { useId } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ProfilePicture } from "@/components/profile-picture";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useUpdateUserProfile } from "@/hooks/useUserProfile";
import { useMediaQuery } from "@/integrations/media-query";
import { m } from "@/paraglide/messages";
import { profileSchema } from "@/schemas/edit-profile-schema";
import { UpdateProfileForm } from "./forms/update-profile-form";

interface EditProfileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	bio?: string | null;
	location?: string | null;
}

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EditProfileDialog({
	open,
	onOpenChange,
	bio,
	location,
}: EditProfileDialogProps) {
	const { authData } = useRouteContext({ from: "__root__" });
	if (!authData) return null;
	const id = useId();

	const isMobile = useMediaQuery("(pointer: coarse)");
	const updateProfile = useUpdateUserProfile();

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		mode: "onTouched",
		defaultValues: {
			bio: bio ?? "",
			location: location ?? "",
		},
	});

	const onFormSubmit: SubmitHandler<ProfileFormValues> = async (formData) => {
		await updateProfile.mutateAsync(formData, {
			onSuccess: (data) => {
				onOpenChange(false);
				form.reset({
					bio: data.user.bio ?? "",
					location: data.user.location ?? "",
				});
			},
		});
	};

	const { displayName, image: avatar } = authData.user;
	const isSubmitting = updateProfile.isPending;

	const formContent = (
		<form id={`${id}-profile-form`} onSubmit={form.handleSubmit(onFormSubmit)}>
			<fieldset disabled={isSubmitting}>
				<UpdateProfileForm form={form} id={id} name={displayName ?? ""} />
			</fieldset>
		</form>
	);

	const footer = (
		<Button
			type="submit"
			form={`${id}-profile-form`}
			disabled={isSubmitting || !form.formState.isDirty}
			className="w-full"
		>
			{isSubmitting ? m.btn_saving() : m.btn_save()}
		</Button>
	);

	return isMobile ? (
		// @todo: add icon button in avatar to upload new image
		// add profile banner with edit/delete button
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="max-h-[96vh]">
				<DrawerHeader className="justify-start items-start">
					<DrawerTitle>{m.edit_profile_title()}</DrawerTitle>
				</DrawerHeader>
				<div className="overflow-y-auto px-4 pb-4">
					<div className="flex flex-col gap-4">
						<ProfilePicture avatar={avatar} displayName={displayName ?? ""} />
						<Separator />
						{formContent}
					</div>
				</div>
				<DrawerFooter>{footer}</DrawerFooter>
			</DrawerContent>
		</Drawer>
	) : (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{m.edit_profile_title()}</DialogTitle>
				</DialogHeader>
				<div className="px-4 overflow-y-auto max-h-[60vh]">
					<div className="flex flex-col gap-4 py-4">
						<ProfilePicture avatar={avatar} displayName={displayName ?? ""} />
						<Separator />
						{formContent}
					</div>
				</div>
				<DialogFooter>{footer}</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

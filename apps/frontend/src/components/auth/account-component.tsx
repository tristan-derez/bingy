import { UpdatePasswordForm } from "@/components/auth/forms/update-password-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DeleteAccountTrigger } from "./delete-account";

export function AccountComponent() {
	return (
		<Card className="mx-auto max-w-sm min-w-[420px] p-4">
			<CardTitle>Edit account</CardTitle>
			<CardDescription>
				Make changes to your account informations here.
			</CardDescription>
			<Separator />
			<UpdatePasswordForm />
			<Separator />
			<DeleteAccountTrigger />
		</Card>
	);
}

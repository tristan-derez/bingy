import { IconLoader } from "@tabler/icons-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { m } from "@/paraglide/messages";

export function TwoFactorDialog({
	open,
	onOpenChange,
	onVerify,
	isVerifying = false,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onVerify: (code: string) => Promise<void>;
	isVerifying?: boolean;
}) {
	const [code, setCode] = useState("");

	const handleVerify = async () => {
		await onVerify(code);
		setCode("");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="xs:w-full max-w-sm lg:max-w-xl">
				<DialogHeader>
					<DialogTitle>{m.dialog_title_two_factor()}</DialogTitle>
					<DialogDescription>{m.dialog_desc_two_factor()}</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center mt-4 gap-8">
					<div className="flex justify-center">
						<InputOTP
							maxLength={6}
							pattern={REGEXP_ONLY_DIGITS}
							value={code}
							onChange={setCode}
							disabled={isVerifying}
						>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
							</InputOTPGroup>
							<InputOTPSeparator />
							<InputOTPGroup>
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
					</div>
					<Button
						onClick={handleVerify}
						disabled={code.length !== 6 || isVerifying}
						className="w-[280px]"
					>
						{isVerifying ? (
							<span className="flex items-center justify-center gap-2">
								<IconLoader className="animate-spin h-4 w-4" />
								{m.dialog_btn_verifying()}
							</span>
						) : (
							m.dialog_btn_verify()
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

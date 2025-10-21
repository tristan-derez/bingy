import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Two-Factor Authentication</DialogTitle>
					<DialogDescription>
						Enter the 6-digit code from your authenticator app
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center mt-4 gap-8 w-full">
					<div className="flex justify-center">
						<InputOTP
							maxLength={6}
							pattern={REGEXP_ONLY_DIGITS}
							value={code}
							onChange={setCode}
							disabled={isVerifying}
							className="w-full"
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
								<Loader2 className="animate-spin h-4 w-4" />
								Verifying
							</span>
						) : (
							"Verify"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

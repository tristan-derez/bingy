import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
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

export function SetupTwoFactorDialog({
	open,
	onOpenChange,
	totpUri,
	onVerify,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	totpUri: string;
	onVerify: (code: string) => void;
}) {
	const [code, setCode] = useState("");

	const extractSecret = (uri: string) => {
		try {
			const url = new URL(uri);
			return url.searchParams.get("secret") || "";
		} catch {
			return "";
		}
	};

	const secret = extractSecret(totpUri);

	const copyText = () => {
		navigator.clipboard.writeText(secret);
		toast.success("Secret copied to clipboard");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Two-Factor Authentication</DialogTitle>
					<DialogDescription>
						Scan the QR code with your authenticator app, then enter the 6-digit
						code
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center gap-4">
					{totpUri && (
						<div className="bg-white p-2 rounded-lg">
							<QRCode value={totpUri} size={264} />
						</div>
					)}
					{secret && (
						<div className="text-center w-full px-2">
							<p className="text-sm text-muted-foreground">
								Or setup manually with the secret:
							</p>
							<Button
								variant="ghost"
								className="font-mono text-xs sm:text-sm font-semibold break-all blur-sm hover:blur-none transition-all h-auto"
								onClick={copyText}
							>
								{secret}
							</Button>
						</div>
					)}
					<div className="flex flex-col items-center gap-4 max-w-xs">
						<InputOTP
							maxLength={6}
							pattern={REGEXP_ONLY_DIGITS}
							value={code}
							onChange={setCode}
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
						<Button
							onClick={() => onVerify(code)}
							disabled={code.length !== 6}
							className="w-full"
						>
							Verify
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

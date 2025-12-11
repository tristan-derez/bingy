import { ArrowLeft } from "lucide-react";
import { Button } from "./button";

interface BackButtonProps {
	onBack?: () => void;
	style?: string;
	variant?: "ghost" | "default" | "outline" | "secondary" | "link";
	text?: string;
}

export const BackButton = ({
	onBack,
	style,
	variant = "ghost",
	text,
}: BackButtonProps) => {
	return (
		<Button
			onClick={onBack}
			variant={variant}
			className={`${style} rounded-xl`}
		>
			<ArrowLeft className="h-4 w-4" /> {text ? text : null}
		</Button>
	);
};

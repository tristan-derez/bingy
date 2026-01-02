import { IconArrowLeft } from "@tabler/icons-react";
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
			<IconArrowLeft /> {text ? text : null}
		</Button>
	);
};

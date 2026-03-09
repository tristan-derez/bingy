import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "./button";

interface BackButtonProps {
	style?: string;
	variant?: "ghost" | "default" | "outline" | "secondary" | "link";
	text?: string;
}

export const BackButton = ({
	style,
	variant = "ghost",
	text,
}: BackButtonProps) => {
	const router = useRouter();

	if (!router.history.canGoBack()) return null;

	return (
		<Button
			onClick={() => router.history.back()}
			variant={variant}
			className={`${style} rounded-xl`}
		>
			<IconArrowLeft /> {text ? text : null}
		</Button>
	);
};

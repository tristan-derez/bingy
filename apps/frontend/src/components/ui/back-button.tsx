import { ArrowLeft } from "lucide-react";
import { m } from "@/paraglide/messages";
import { Button } from "./button";

interface BackButtonProps {
	onBack?: () => void;
	style?: string;
	variant?: string;
}

export const BackButton = ({ onBack, style }: BackButtonProps) => {
	return (
		<Button onClick={onBack} variant="outline" className={style}>
			<ArrowLeft className="h-4 w-4" /> {m.btn_back()}
		</Button>
	);
};

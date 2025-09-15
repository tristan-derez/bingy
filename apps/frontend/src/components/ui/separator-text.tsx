import { Separator } from "./separator";

function SeparatorWithText({ text }: { text?: string }) {
	return (
		<div className="relative">
			<div className="absolute inset-0 flex items-center">
				<Separator className="w-full" />
			</div>
			<div className="relative flex justify-center text-xs uppercase">
				<span className="bg-card px-2 text-muted-foreground">{text}</span>
			</div>
		</div>
	);
}

export { SeparatorWithText };

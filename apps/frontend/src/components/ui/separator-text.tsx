import { Separator } from "./separator";

export function SeparatorWithText({ text }: { text: string }) {
	return (
		<div className="flex items-center gap-2">
			<Separator className="flex-1" />
			<span className="text-xs uppercase text-muted-foreground">{text}</span>
			<Separator className="flex-1" />
		</div>
	);
}

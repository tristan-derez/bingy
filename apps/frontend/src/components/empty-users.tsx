import { IconUsers } from "@tabler/icons-react";

interface EmptyUsersProps {
	message: string;
}

export function EmptyUsers({ message }: EmptyUsersProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
			<IconUsers className="h-10 w-10" />
			<p className="text-sm">{message}</p>
		</div>
	);
}

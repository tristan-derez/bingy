import type { ReactNode } from "react";

export function CenteredLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col items-center justify-center flex-1">
			{children}
		</div>
	);
}

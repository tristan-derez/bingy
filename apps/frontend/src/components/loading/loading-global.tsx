import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoaderTwo } from "../ui/loader";

export function GlobalLoadingIndicator() {
	const isLoading = useRouterState({ select: (s) => s.isLoading });
	const [showLoader, setShowLoader] = useState(false);

	useEffect(() => {
		if (isLoading) {
			const timer = setTimeout(() => setShowLoader(true), 500);
			return () => clearTimeout(timer);
		} else {
			setShowLoader(false);
		}
	}, [isLoading]);

	if (!showLoader) return null;

	return (
		<div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
			<div className="bg-card text-foreground rounded-sm p-8 shadow-lg">
				<LoaderTwo />
			</div>
		</div>
	);
}

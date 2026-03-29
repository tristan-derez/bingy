import { useMatches } from "@tanstack/react-router";

/**
 * check if current route is a profile route
 * and if it is, return false
 */
export function useShowTopMobileNavbar(): boolean {
	const matches = useMatches();
	const isProfileRoute = matches.some(
		(match) => match.routeId === "/@{$username}",
	);
	return !isProfileRoute;
}

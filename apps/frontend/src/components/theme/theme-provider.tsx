import { useCallback, useEffect, useState } from "react";
import { ThemeProviderContext } from "./theme-context";
import type { Theme, ThemeProviderProps } from "./types";

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
	...props
}: ThemeProviderProps) {
	const getInitialTheme = (): Theme => {
		if (typeof window === "undefined") return defaultTheme;

		const stored = localStorage.getItem(storageKey);
		return stored === "light" || stored === "dark" || stored === "system"
			? stored
			: defaultTheme;
	};

	const [theme, setThemeState] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		const root = document.documentElement;
		root.classList.remove("light", "dark");

		const applyTheme = (t: Theme) => {
			if (t === "system") {
				const mq = window.matchMedia("(prefers-color-scheme: dark)");
				root.classList.add(mq.matches ? "dark" : "light");
			} else {
				root.classList.add(t);
			}
		};

		applyTheme(theme);

		if (theme === "system") {
			const mq = window.matchMedia("(prefers-color-scheme: dark)");
			const listener = (e: MediaQueryListEvent) => {
				root.classList.remove("light", "dark");
				root.classList.add(e.matches ? "dark" : "light");
			};
			mq.addEventListener("change", listener);
			return () => mq.removeEventListener("change", listener);
		}
	}, [theme]);

	const setTheme = useCallback(
		(newTheme: Theme) => {
			if (typeof window !== "undefined")
				localStorage.setItem(storageKey, newTheme);
			setThemeState(newTheme);
		},
		[storageKey],
	);

	return (
		<ThemeProviderContext.Provider {...props} value={{ theme, setTheme }}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

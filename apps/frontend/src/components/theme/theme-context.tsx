import { createContext } from "react";
import type { ThemeProviderState } from "./types";

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => undefined,
};

export const ThemeProviderContext =
	createContext<ThemeProviderState>(initialState);

import { IconBrandWindowsFilled, IconMoon, IconSun } from "@tabler/icons-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";
import { useTheme } from "./use-theme";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();
	const containerRef = useRef<HTMLDivElement>(null);

	const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
		if (theme === newTheme) return;

		if (typeof window === "undefined") return;

		if (!document.startViewTransition) {
			setTheme(newTheme);
			return;
		}

		document.startViewTransition(() => {
			setTheme(newTheme);
		});
	};

	return (
		<div ref={containerRef} className="flex flex-col md:flex-row gap-2 w-full">
			<Button
				variant={theme === "light" ? "default" : "outline"}
				onClick={() => handleThemeChange("light")}
				disabled={theme === "light"}
				className="flex items-center justify-start md:justify-center gap-2 w-full md:flex-1"
			>
				<IconSun />
				{m.btn_light_mode()}
			</Button>

			<Button
				variant={theme === "dark" ? "default" : "outline"}
				onClick={() => handleThemeChange("dark")}
				disabled={theme === "dark"}
				className="flex items-center justify-start md:justify-center gap-2 w-full md:flex-1"
			>
				<IconMoon />
				{m.btn_dark_mode()}
			</Button>

			<Button
				variant={theme === "system" ? "default" : "outline"}
				onClick={() => handleThemeChange("system")}
				disabled={theme === "system"}
				className="flex items-center justify-start md:justify-center gap-2 w-full md:flex-1"
			>
				<IconBrandWindowsFilled />
				{m.btn_system_mode()}
			</Button>
		</div>
	);
}

import { IconBrandWindowsFilled, IconMoon, IconSun } from "@tabler/icons-react";
import { useRef } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";
import { useTheme } from "./use-theme";

interface ModeToggleProps {
	duration?: number;
}

export function ModeToggle({ duration = 700 }: ModeToggleProps) {
	const { theme, setTheme } = useTheme();
	const containerRef = useRef<HTMLDivElement>(null);

	const handleThemeChange = async (
		newTheme: "light" | "dark" | "system",
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		if (theme === newTheme) return;

		const button = event.currentTarget;

		await document.startViewTransition(() => {
			flushSync(() => {
				setTheme(newTheme);
			});
		}).ready;

		const { top, left, width, height } = button.getBoundingClientRect();
		const x = left + width / 2;
		const y = top + height / 2;
		const maxRadius = Math.hypot(
			Math.max(left, window.innerWidth - left),
			Math.max(top, window.innerHeight - top),
		);

		document.documentElement.animate(
			{
				clipPath: [
					`circle(0px at ${x}px ${y}px)`,
					`circle(${maxRadius}px at ${x}px ${y}px)`,
				],
			},
			{
				duration,
				easing: "ease-in-out",
				pseudoElement: "::view-transition-new(root)",
			},
		);

		const messages: Record<typeof newTheme, string[]> = {
			light: [
				m.toast_light_joke(),
				m.toast_light_joke_two(),
				m.toast_light_joke_three(),
			],
			dark: [
				m.toast_dark_joke(),
				m.toast_dark_joke_two(),
				m.toast_dark_joke_three(),
			],
			system: [m.toast_system_joke()],
		};

		const choices = messages[newTheme];
		toast.success(choices[Math.floor(Math.random() * choices.length)]);
	};

	return (
		<div ref={containerRef} className="flex space-x-2 w-full">
			<Button
				variant={theme === "light" ? "default" : "outline"}
				onClick={(e) => handleThemeChange("light", e)}
				className={`flex items-center gap-2 w-28 ${theme === "light" ? "hover:cursor-not-allowed" : ""}`}
			>
				<IconSun />
				{m.btn_light_mode()}
			</Button>

			<Button
				variant={theme === "dark" ? "default" : "outline"}
				onClick={(e) => handleThemeChange("dark", e)}
				className={`flex items-center gap-2 w-28 ${theme === "dark" ? "hover:cursor-not-allowed" : ""}`}
			>
				<IconMoon />
				{m.btn_dark_mode()}
			</Button>

			<Button
				variant={theme === "system" ? "default" : "outline"}
				onClick={(e) => handleThemeChange("system", e)}
				className={`flex items-center gap-2 w-28 ${theme === "system" ? "hover:cursor-not-allowed" : ""}`}
			>
				<IconBrandWindowsFilled />
				{m.btn_system_mode()}
			</Button>
		</div>
	);
}

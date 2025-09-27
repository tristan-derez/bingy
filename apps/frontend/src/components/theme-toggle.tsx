import { FaMoon, FaSun } from "react-icons/fa";
import { GrSystem } from "react-icons/gr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme/use-theme";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
		setTheme(newTheme);

		if (newTheme === "light") {
			const messages = [
				"Let light shine out of darkness",
				"Welcome to the bright side! Don't forget your sunglasses 😎",
				"Let there be light!",
				"The darkness always passes, and the light comes back",
			];
			toast.success(messages[Math.floor(Math.random() * messages.length)]);
		} else if (newTheme === "dark") {
			const messages = [
				"Welcome to the dark side!",
				"So the darkness shall be the light",
				"Going incognito from the sun!",
			];
			toast.success(messages[Math.floor(Math.random() * messages.length)]);
		} else if (newTheme === "system") {
			const messages = [
				"Following your system's lead!",
				"Passing the buck to your OS... classic move!",
				"I'm just here for the ride, your OS is driving",
			];
			toast.success(messages[Math.floor(Math.random() * messages.length)]);
		}
	};

	return (
		<div className="flex space-x-2 w-full">
			<Button
				variant={theme === "light" ? "default" : "outline"}
				onClick={() => handleThemeChange("light")}
				className="flex items-center gap-2 w-28"
			>
				<FaSun className="h-4 w-4" />
				Light
			</Button>

			<Button
				variant={theme === "dark" ? "default" : "outline"}
				onClick={() => handleThemeChange("dark")}
				className="flex items-center gap-2 w-28"
			>
				<FaMoon className="h-4 w-4" />
				Dark
			</Button>

			<Button
				variant={theme === "system" ? "default" : "outline"}
				onClick={() => handleThemeChange("system")}
				className="flex items-center gap-2 w-28"
			>
				<GrSystem className="h-4 w-4" />
				System
			</Button>
		</div>
	);
}

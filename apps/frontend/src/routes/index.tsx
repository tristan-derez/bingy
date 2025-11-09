import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";
import { CenteredLayout } from "@/components/layout/centered-layout";
import { useTheme } from "@/components/theme/use-theme";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Particles } from "@/components/ui/particles";
import { SparklesText } from "@/components/ui/sparkles-text";

export const Route = createFileRoute("/")({
	component: App,
	beforeLoad: async ({ context }) => {
		if (context.session?.user) {
			throw redirect({ to: "/dashboard" });
		}
	},
});

function App() {
	const { theme } = useTheme();
	const navigate = useNavigate();

	const getParticleColor = () => {
		if (theme === "system") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "#fff"
				: "#000";
		}
		return theme === "dark" ? "#fff" : "#000";
	};

	return (
		<CenteredLayout>
			<div className="flex flex-col items-center gap-8 text-center max-w-4xl">
				<h1 className="text-4xl md:text-6xl font-bold leading-tight">
					<strong className="inline-block">Track what you watch.</strong>
					<br />
					<SparklesText
						sparklesCount={5}
						className="inline-block text-4xl md:text-6xl"
					>
						Discover
					</SparklesText>
					<strong> what's next.</strong>
				</h1>

				<p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
					Track every movie and show you watch, rate what you've seen, manage
					your watchlist, and discover what your friends are loving—all in one
					place
				</p>

				<div className="flex gap-4">
					<Button
						variant="outline"
						className="transition-transform hover:scale-105 h-11"
						onClick={() => {
							navigate({ to: "/features" });
						}}
					>
						View Features
					</Button>

					<HoverBorderGradient
						containerClassName="rounded-md"
						className="flex items-center gap-2 hover:cursor-pointer"
						onClick={() => {
							navigate({ to: "/signup" });
						}}
						as="button"
					>
						Get Started <FaArrowRight />
					</HoverBorderGradient>
				</div>
			</div>

			<Particles
				className="absolute inset-0 z-0"
				quantity={100}
				ease={80}
				color={getParticleColor()}
				refresh
			/>
		</CenteredLayout>
	);
}

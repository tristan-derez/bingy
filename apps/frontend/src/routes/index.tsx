import { IconArrowRight } from "@tabler/icons-react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { CenteredLayout } from "@/components/layout/centered-layout";
import { useTheme } from "@/components/theme/use-theme";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Particles } from "@/components/ui/particles";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/")({
	component: App,
	beforeLoad: async ({ context }) => {
		if (context.authData?.user) {
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
				<h1 className="text-4xl md:text-6xl font-bold leading-relaxed">
					<strong className="inline-block">{m.landing_page_title()}</strong>
					<br />
					<strong>
						{m.landing_page_title_discover()}{" "}
						{m.landing_page_title_whats_next()}
					</strong>
				</h1>

				<p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
					{m.landing_page_desc()}
				</p>

				<div className="flex gap-4">
					<Button
						variant="outline"
						className="transition-transform hover:scale-105 h-11"
						onClick={() => {
							navigate({ to: "/" });
						}}
					>
						{m.landing_page_btn_search()}
					</Button>

					<HoverBorderGradient
						containerClassName="rounded-md"
						className="flex items-center gap-2 hover:cursor-pointer"
						onClick={() => {
							navigate({ to: "/signup" });
						}}
						as="button"
					>
						{m.landing_page_btn_get_started()} <IconArrowRight />
					</HoverBorderGradient>
				</div>
			</div>

			<Particles
				className="absolute inset-0 z-0"
				quantity={50}
				ease={80}
				color={getParticleColor()}
				refresh
			/>
		</CenteredLayout>
	);
}

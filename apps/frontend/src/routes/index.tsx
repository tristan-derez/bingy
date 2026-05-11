import {
	IconArrowRight,
	IconDeviceTv,
	IconMovie,
	IconUsersGroup,
} from "@tabler/icons-react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
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
		<>
			{/* Hero Section - Always centered in viewport */}
			<section className="h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-8rem)] flex items-center justify-center relative">
				<div className="flex flex-col items-center gap-6 text-center max-w-4xl">
					<h1 className="text-3xl md:text-6xl font-bold leading-relaxed">
						<strong className="inline-block">{m.landing_page_title()}</strong>
						<strong>{m.landing_page_title_followup()}</strong>
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
							containerClassName="rounded-md hover:cursor-pointer"
							className="flex items-center gap-2"
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
			</section>

			{/* Features Section */}
			<section className="min-h-[80vh] flex items-center">
				<div className="flex flex-col items-center gap-6 text-center max-w-4xl">
					<h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
						{m.landing_page_features_heading()}
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
							<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
								<IconMovie className="w-6 h-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{m.landing_page_features_card1_title()}
							</h3>
							<p className="text-muted-foreground">
								{m.landing_page_features_card1_description()}
							</p>
						</div>

						<div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
							<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
								<IconUsersGroup className="w-6 h-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{m.landing_page_features_card2_title()}
							</h3>
							<p className="text-muted-foreground">
								{m.landing_page_features_card2_description()}
							</p>
						</div>

						<div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
							<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
								<IconDeviceTv className="w-6 h-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{m.landing_page_features_card3_title()}
							</h3>
							<p className="text-muted-foreground">
								{m.landing_page_features_card3_description()}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="min-h-[80vh] flex items-center">
				<div className="flex flex-col items-center gap-6 text-center max-w-4xl">
					<h2 className="text-3xl md:text-5xl font-bold">
						{m.landing_page_cta_heading()}
					</h2>
					<p className="text-lg text-muted-foreground">
						{m.landing_page_cta_description()}
					</p>
					<HoverBorderGradient
						containerClassName="rounded-lg self-center hover:cursor-pointer"
						className="flex items-center gap-2"
						onClick={() => {
							navigate({ to: "/signup" });
						}}
						as="button"
					>
						{m.landing_page_cta_button()}
					</HoverBorderGradient>
				</div>
			</section>
		</>
	);
}

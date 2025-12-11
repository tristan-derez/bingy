import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { m } from "@/paraglide/messages";
import { CreditEpisodeCard } from "./credit-episode-card";

interface CreditEpisodesListProps {
	tvId: number;
	personName: string;
	character: string;
	job?: string;
	showName: string;
	posterPath: string | null;
	onBack: () => void;
	guestEpisodeIds: Set<number>;
	episodes: Omit<Schemas.Episode, "media_type">[];
}

export const CreditEpisodesList = ({
	tvId,
	personName,
	character,
	job,
	showName,
	posterPath,
	onBack,
	guestEpisodeIds,
	episodes,
}: CreditEpisodesListProps) => {
	const role = character || job || m.credit_episodes_list_unknown_role();
	return (
		<div className="container">
			<BackButton onBack={onBack} />

			<div className="grid lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 pt-2 justify-items-center">
				<div className="flex flex-col gap-2 items-center lg:items-start max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
					<img
						src={
							posterPath
								? `https://image.tmdb.org/t/p/original${posterPath}`
								: fallbackPoster
						}
						alt={showName}
						className="rounded-md shadow-lg w-full aspect-2/3 max-h-90 xl:max-h-[600px]"
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
					/>
				</div>

				<div className="w-full flex flex-col gap-4 overflow-hidden">
					<Card className="shadow-none bg-transparent pt-0 lg:p-0 border-none">
						<CardContent className="lg:p-0">
							<div className="flex flex-col gap-2">
								<Link to="/tv/$tvId" params={{ tvId: tvId.toString() }}>
									<h1 className="text-4xl font-bold leading-relaxed">
										{showName}
									</h1>
								</Link>

								<p className="text-xl text-muted-foreground mt-2">
									<span className="text-foreground">{personName}</span>{" "}
									{m.credit_episodes_list_as({ role: role })}
								</p>
							</div>
						</CardContent>
					</Card>
					<Separator />
					{episodes.map((episode) => (
						<CreditEpisodeCard
							key={episode.id}
							episode={episode}
							tvId={tvId}
							isGuestAppearance={
								character ? guestEpisodeIds.has(episode.id) : false
							}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

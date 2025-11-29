import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
	return (
		<div className="container">
			<Button onClick={onBack} className="mb-4" variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="grid xl:grid-cols-[auto_1fr] gap-4 justify-items-center">
				<div className="flex flex-col gap-2 items-center xl:items-start max-w-[400px]">
					<img
						src={`https://image.tmdb.org/t/p/w200${posterPath}`}
						alt={showName}
						className="rounded-md"
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
					/>
				</div>

				<div className="flex flex-col gap-4 overflow-hidden max-w-full w-full">
					<Card className="shadow-none bg-transparent pt-0 xl:p-0 border-none">
						<CardContent className="xl:p-0">
							<div className="flex flex-col gap-2">
								<Link to="/tv/$tvId" params={{ tvId: tvId.toString() }}>
									<h1 className="text-4xl font-bold leading-tight">
										{showName}
									</h1>
								</Link>

								<p className="text-xl text-muted-foreground mt-2">
									<span className="text-foreground">{personName}</span> as{" "}
									{character ? character : job}
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
							isGuestAppearance={guestEpisodeIds.has(episode.id)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

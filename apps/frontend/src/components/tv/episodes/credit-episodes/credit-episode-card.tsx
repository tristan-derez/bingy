import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { formatRuntime } from "@/utils/format-runtime";

interface CreditEpisodeCardProps {
	episode: {
		id: number;
		name: string;
		season_number: number;
		episode_number: number;
		still_path: string | null;
		overview: string | null;
		runtime: number | null;
		air_date: string | null;
	};
	tvId: number;
	isGuestAppearance: boolean;
}

export const CreditEpisodeCard = ({
	episode,
	tvId,
	isGuestAppearance,
}: CreditEpisodeCardProps) => {
	const localeRegion = useAtomValue(localeRegionAtom);
	const backgroundImage = episode.still_path
		? `https://image.tmdb.org/t/p/w500${episode.still_path}`
		: null;

	return (
		<Card
			className={`relative overflow-hidden min-h-[200px] rounded-md ${
				backgroundImage
					? "text-dark-card-foreground border-none"
					: "text-foreground border"
			}`}
			style={
				backgroundImage
					? {
							backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}
					: undefined
			}
		>
			<CardHeader>
				<div className="flex items-start justify-between gap-2">
					<div className="flex items-center gap-2 flex-1">
						<Link
							to="/tv/$tvId/season/$seasonNumber/episode/$episodeNumber"
							params={{
								tvId: tvId.toString(),
								seasonNumber: episode.season_number.toString(),
								episodeNumber: episode.episode_number.toString(),
							}}
						>
							<CardTitle>{episode.name}</CardTitle>
						</Link>
						{episode.runtime ? (
							<Badge variant="secondary">
								{formatRuntime(episode.runtime)}
							</Badge>
						) : null}
						{isGuestAppearance ? (
							<Badge variant="default">{m.badge_credit_episode_guest()}</Badge>
						) : null}
					</div>
					<div className="text-sm whitespace-nowrap">
						{episode.season_number}x{episode.episode_number}
					</div>
				</div>
				<CardDescription
					className={`w-full xl:max-w-2/3 ${
						backgroundImage ? "text-dark-card-foreground" : "text-foreground"
					}`}
				>
					{episode.overview || m.overview_none()}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-1 mt-auto">
				{episode.air_date ? (
					<div className="text-sm">
						{new Date(episode.air_date) > new Date()
							? m.credit_episode_card_airs_text({
									date: formatDate(episode.air_date, localeRegion),
								})
							: m.credit_episode_card_aired_text({
									date: formatDate(episode.air_date, localeRegion),
								})}
					</div>
				) : (
					<p className="text-sm">{m.credit_episode_card_not_aired_text()}</p>
				)}
			</CardContent>
		</Card>
	);
};

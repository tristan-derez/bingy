import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/media-image-placeholder.jpg";
import fallbackPersonPoster from "@/assets/user-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { PersonBadge } from "@/components/badges/person-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { localeAtom } from "@/lib/atoms/locale";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { getTruncatedContent } from "@/utils/truncate-content";
import { getTmdbImageUrl } from "@/utils/utils";

interface SearchCardProps {
	item: Schemas.MediaMulti;
}

const getCardConfig = (item: Schemas.MediaMulti) => {
	if (item.media_type === "movie") {
		const movie = item as Schemas.MovieMedia;
		return {
			imageUrl: getTmdbImageUrl(movie.poster_path, "w500") ?? fallbackPoster,
			title: movie.title,
			subtitle:
				movie.original_title.toLowerCase() !== movie.title.toLowerCase()
					? movie.original_title
					: null,
			releaseDate: movie.release_date,
			overview: movie.overview,
			badge: <MovieBadge />,
			link: {
				to: "/movies/$movieId" as const,
				params: { movieId: String(movie.id) },
			},
		};
	}

	if (item.media_type === "tv") {
		const tv = item as Schemas.TvMedia;
		return {
			imageUrl: getTmdbImageUrl(tv.poster_path, "w500") ?? fallbackPoster,
			title: tv.name,
			subtitle:
				tv.original_name.toLowerCase() !== tv.name.toLowerCase()
					? tv.original_name
					: null,
			releaseDate: tv.first_air_date,
			overview: tv.overview,
			badge: <TvShowBadge />,
			link: { to: "/tv/$tvId" as const, params: { tvId: String(tv.id) } },
		};
	}

	const person = item as Schemas.PersonExtended;
	return {
		imageUrl:
			getTmdbImageUrl(person.profile_path, "w500") ?? fallbackPersonPoster,
		title: person.name,
		subtitle: person.known_for_department,
		overview: person.known_for?.length
			? `${m.person_known_for({ gender: person.gender === 1 ? "female" : "male" })}: ${person.known_for
					.map((media) =>
						media.media_type === "movie"
							? (media as Schemas.MovieMedia).title
							: (media as Schemas.TvMedia).name,
					)
					.join(" - ")}`
			: undefined,
		badge: <PersonBadge />,
		link: {
			to: "/person/$personId" as const,
			params: { personId: String(person.id) },
		},
	};
};

export const SearchCard = ({ item }: SearchCardProps) => {
	const navigate = useNavigate();
	const locale = useAtomValue(localeAtom);
	const config = getCardConfig(item);

	const overview = getTruncatedContent(config.overview ?? "");

	return (
		<div
			className="flex gap-4 hover:bg-accent transition-colors select-none h-[170px] md:h-[200px] cursor-pointer rounded-lg overflow-hidden"
			onClick={() => navigate(config.link)}
		>
			<img
				src={config.imageUrl}
				alt={config.title}
				className="w-[100px] md:w-[133px] object-cover shrink-0"
			/>

			<div className="flex flex-col gap-2 py-4 pr-4 min-w-0 flex-1">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-baseline gap-2 min-w-0">
						<h3 className="text-sm md:text-xl font-semibold line-clamp-1 leading-relaxed">
							{config.title}
						</h3>
						{config.releaseDate ? (
							<span className="text-sm text-muted-foreground shrink-0">
								{formatDate(config.releaseDate, locale, { year: "numeric" })}
							</span>
						) : null}
					</div>
					{config.badge}
				</div>

				{config.subtitle ? (
					<p className="text-sm text-muted-foreground line-clamp-1">
						{config.subtitle}
					</p>
				) : null}

				{overview.displayText ? (
					<p className="text-sm text-muted-foreground line-clamp-4">
						{overview.displayText}
					</p>
				) : null}
			</div>
		</div>
	);
};

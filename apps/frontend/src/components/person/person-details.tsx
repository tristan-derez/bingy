import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/user-placeholder.jpg";
import { localeWithRegionAtom } from "@/lib/atoms/locale";
import { m } from "@/paraglide/messages";
import { calculateAge } from "@/utils/calculate-age";
import { formatDate } from "@/utils/format-date";
import { getSocialUrls } from "@/utils/social-urls";
import { sortKnownForCredits } from "@/utils/sort-known-credits";
import { ResourceNotFound } from "../errors/resource-not-found";
import { LoadingCentered } from "../loading/loading-centered";
import { MediasCarousel } from "../medias/medias-carousel";
import { SocialLinks } from "../social-links";
import { BackButton } from "../ui/back-button";
import { Badge } from "../ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { PersonBiography } from "./person-biography";
import { PersonTimeline } from "./person-timeline";

interface PersonDetailsViewProps {
	person: Schemas.PersonDetailsWithCombinedCreditsAndSocials | undefined;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export const PersonDetailsView = ({
	person,
	isLoading,
	isError,
	onBack,
}: PersonDetailsViewProps) => {
	const localeWithRegion = useAtomValue(localeWithRegionAtom);

	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !person) {
		return (
			<ResourceNotFound
				title={m.error_title_not_found_person()}
				description={m.error_desc_not_found_person()}
				onBack={onBack}
			/>
		);
	}

	const socialUrls = person.external_ids
		? getSocialUrls(person.external_ids)
		: {};

	const sortedCredits = sortKnownForCredits(person);

	const imageUrl = person?.profile_path
		? `https://image.tmdb.org/t/p/w500${person.profile_path}`
		: fallbackPoster;

	return (
		<div className="container">
			<BackButton onBack={onBack} />

			<div className="grid xl:grid-cols-[auto_1fr] pt-2 gap-4 justify-items-center">
				<div className="flex flex-col gap-2 items-center xl:items-start max-w-[400px]">
					<img
						src={imageUrl}
						alt={person.name}
						className="rounded-lg shadow-lg w-full xl:max-h-[600px]"
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
					/>
					{person.also_known_as && person.also_known_as.length > 0 ? (
						<div className="hidden xl:flex mt-2 text-muted-foreground">
							<div className="flex flex-col">
								<h3 className="font-bold text-foreground">Also known as:</h3>
								{person.also_known_as.map((name: string, index: number) => (
									<span key={index}>{name.trim()}</span>
								))}
							</div>
						</div>
					) : null}
				</div>

				<div className="max-w-full w-full flex flex-col gap-4 overflow-hidden">
					<Card className="shadow-none bg-transparent xl:p-0 border-none">
						<CardContent className="xl:p-0">
							<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
								<div className="flex flex-col gap-2">
									<h1 className="text-4xl font-bold leading-relaxed">
										{person.name}
									</h1>
									{person.birthday ? (
										<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-muted-foreground">
											<div className="flex items-center gap-1">
												<span>
													{formatDate(person.birthday, localeWithRegion)}
												</span>
												{!person.deathday && (
													<span>
														(
														{m.person_age({
															age: calculateAge(person.birthday),
														})}
														)
													</span>
												)}
											</div>
											{person.deathday && (
												<>
													<span className="hidden sm:inline">-</span>
													<div className="flex items-center gap-1">
														<span>
															{formatDate(person.deathday, localeWithRegion)}
														</span>
														<span>
															(
															{m.person_death_age({
																age: calculateAge(
																	person.birthday,
																	person.deathday,
																),
															})}
															)
														</span>
													</div>
												</>
											)}
										</div>
									) : null}
									<p>
										{person.known_for_department === "Acting"
											? person.gender === 1
												? m.person_actress()
												: m.person_actor()
											: person.known_for_department === "Writing"
												? m.person_writer()
												: person.known_for_department === "Directing"
													? person.gender === 1
														? m.person_director_female()
														: m.person_director_male()
													: person.known_for_department}
									</p>
								</div>
								{Object.keys(socialUrls).length > 0 && (
									<div className="lg:self-start mt-3 lg:pr-2">
										<SocialLinks socials={socialUrls} />
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden border-none justify-center">
						<CardHeader className="text-foreground">
							<CardTitle>{m.person_biography()}</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground gap-4">
							<PersonBiography biography={person.biography} />
						</CardContent>
						{person.place_of_birth ? (
							<CardFooter>
								<div className="flex flex-wrap gap-2">
									<Badge
										variant="secondary"
										className="flex items-center gap-2"
									>
										{m.person_place_of_birth({ place: person.place_of_birth })}
									</Badge>
								</div>
							</CardFooter>
						) : null}
					</Card>
					{person.combined_credits ? (
						<div className="flex flex-col gap-4">
							{sortedCredits && sortedCredits.length > 0 ? (
								<MediasCarousel
									medias={sortedCredits}
									title={
										person.gender === 1
											? m.person_known_for_female()
											: m.person_known_for_male()
									}
								/>
							) : null}
							<PersonTimeline combinedCredits={person.combined_credits} />
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

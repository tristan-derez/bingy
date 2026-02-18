import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/user-placeholder.jpg";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { MediasCarousel } from "@/components/medias/medias-carousel";
import { SocialLinks } from "@/components/social-links";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { calculateAge } from "@/utils/calculate-age";
import { formatDate } from "@/utils/format-date";
import { getSocialUrls } from "@/utils/social-urls";
import { sortKnownForCredits } from "@/utils/sort-known-credits";
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
	const localeRegion = useAtomValue(localeRegionAtom);

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

			<div className="grid lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 pt-2 justify-items-center">
				<div className="flex flex-col gap-2 items-center lg:items-start max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
					<img
						src={imageUrl}
						alt={person.name}
						className="rounded-lg shadow-lg w-full aspect-2/3 max-h-90 xl:max-h-[600px]"
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
								<h3 className="font-bold text-foreground">
									{m.person_also_known()}
								</h3>
								{person.also_known_as.map((name: string, index: number) => (
									<span key={index}>{name.trim()}</span>
								))}
							</div>
						</div>
					) : null}
				</div>
				<div className="w-full flex flex-col gap-4 overflow-hidden">
					<Card className="shadow-none bg-transparent ring-0">
						<CardContent className="lg:p-0">
							<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
								<div className="flex flex-col gap-2">
									<h1 className="text-4xl font-bold leading-relaxed">
										{person.name}
									</h1>
									{person.birthday ? (
										<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-muted-foreground">
											<div className="flex items-center gap-1">
												<span>{formatDate(person.birthday, localeRegion)}</span>
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
															{formatDate(person.deathday, localeRegion)}
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
											? m.person_actor({
													gender: person.gender === 1 ? "female" : "male",
												})
											: person.known_for_department === "Writing"
												? m.person_writer({ gender: "*" })
												: person.known_for_department === "Directing"
													? m.person_director({
															gender: person.gender === 1 ? "female" : "male",
														})
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

					<Card className="relative overflow-hidden border-none justify-center ring-0">
						<CardHeader className="text-foreground">
							<CardTitle>{m.person_biography()}</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground gap-4">
							<PersonBiography biography={person.biography} />
							{person.place_of_birth ? (
								<div className="flex flex-wrap gap-2 pt-4">
									<Badge
										variant="secondary"
										className="flex items-center gap-2"
									>
										{person.place_of_birth.includes(",")
											? m.person_place_of_birth({
													gender: person.gender === 1 ? "female" : "male",
													place: person.place_of_birth,
												})
											: m.person_born_country({
													country: person.place_of_birth,
												})}
									</Badge>
								</div>
							) : null}
						</CardContent>
					</Card>
					{person.combined_credits ? (
						<div className="flex flex-col gap-4">
							{sortedCredits && sortedCredits.length > 0 ? (
								<MediasCarousel
									medias={sortedCredits}
									title={m.person_known_for({
										gender: person.gender === 1 ? "female" : "male",
									})}
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

import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { MediasCarousel } from "@/components/medias/medias-carousel";
import { PersonBiography } from "@/components/person/person-biography";
import { PersonProfilePortraitImage } from "@/components/person/person-profile-portrait-image";
import { PersonTimeline } from "@/components/person/person-timeline";
import { SocialLinks } from "@/components/social-links";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { getSocialUrls } from "@/utils/social-urls";
import { sortKnownForCredits } from "@/utils/sort-known-credits";
import { calculateAge } from "@/utils/utils";

interface PersonDetailsViewProps {
	person: Schemas.PersonDetailsWithCombinedCreditsAndSocials | undefined;
	isLoading: boolean;
	isError: boolean;
}

export const PersonDetailsView = ({
	person,
	isLoading,
	isError,
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
			/>
		);
	}

	const socialUrls = person.external_ids
		? getSocialUrls(person.external_ids)
		: {};

	const sortedCredits = sortKnownForCredits(person);

	return (
		<div className="container">
			<BackButton />

			<div className="grid lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 pt-2 justify-items-center">
				<div className="flex flex-col gap-2 items-center lg:items-start max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
					<PersonProfilePortraitImage
						imagePath={person.profile_path}
						alt={person.name}
						imageSize="w500"
					/>

					{person.also_known_as && person.also_known_as.length > 0 ? (
						<div className="hidden lg:flex">
							<div className="flex flex-col">
								<h3 className="font-bold text-foreground text-base">
									{m.person_also_known()}
								</h3>
								<div className="flex flex-col gap-1">
									{person.also_known_as.map((name: string, index: number) => (
										<span
											key={index}
											className="text-muted-foreground text-sm flex-wrap"
										>
											{name.trim()}
										</span>
									))}
								</div>
							</div>
						</div>
					) : null}
				</div>

				<div className="w-full flex flex-col gap-4 overflow-hidden px-1">
					<Card className="shadow-none rounded-none bg-transparent ring-0 lg:p-0">
						<CardContent>
							<div className="flex flex-row justify-between items-start gap-2">
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
							</div>
						</CardContent>
					</Card>

					<Card className="relative justify-center">
						<CardHeader className="text-foreground flex flex-row items-center justify-between w-full">
							<CardTitle>{m.person_biography()}</CardTitle>
							{Object.keys(socialUrls).length > 0 ? (
								<div className="ml-auto">
									<SocialLinks socials={socialUrls} />
								</div>
							) : null}
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

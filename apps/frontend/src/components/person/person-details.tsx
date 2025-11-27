import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import fallbackPoster from "@/assets/user-placeholder.jpg";
import type { PersonDetails } from "@/types/person";
import { calculateAge } from "@/utils/calculate-age";
import { formatDate } from "@/utils/format-date";
import { getSocialUrls } from "@/utils/social-urls";
import { sortKnownForCredits } from "@/utils/sort-known-credits";
import { ResourceNotFound } from "../errors/resource-not-found";
import { LoadingCentered } from "../loading/loading-centered";
import { MediasCarousel } from "../medias/medias-carousel";
import { SocialLinks } from "../social-links";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";

interface PersonDetailsViewProps {
	person: PersonDetails | undefined;
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
	const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !person) {
		return (
			<ResourceNotFound
				title="Person Not Found"
				description="The person you're looking for could not be found."
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
			<Button onClick={onBack} className="mb-4" variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="grid xl:grid-cols-[auto_1fr] gap-4 justify-items-center">
				<div className="flex flex-col gap-2 items-center xl:items-start max-w-[600px]">
					<img
						src={imageUrl}
						alt={person.name}
						className="rounded-lg shadow-lg w-full max-w-[350px] xl:max-h-[600px]"
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
								{person.also_known_as.map((name, index) => (
									<span key={index}>{name.trim()}</span>
								))}
							</div>
						</div>
					) : null}
				</div>

				<div className="max-w-full w-full space-y-4 overflow-hidden">
					<Card className="shadow-none bg-transparent xl:p-0 border-none">
						<CardContent className="xl:p-0">
							<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
								<div className="flex flex-col gap-2">
									<h1 className="text-4xl font-bold leading-tight">
										{person.name}
									</h1>
									{person.birthday ? (
										<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-muted-foreground">
											<div className="flex items-center gap-2">
												<span>{formatDate(person.birthday, "en-US")}</span>
												{!person.deathday && (
													<span>
														({calculateAge(person.birthday)} years old)
													</span>
												)}
											</div>
											{person.deathday && (
												<>
													<span className="hidden sm:inline">-</span>
													<div className="flex items-center gap-2">
														<span>{formatDate(person.deathday, "en-US")}</span>
														<span>
															(aged{" "}
															{calculateAge(person.birthday, person.deathday)})
														</span>
													</div>
												</>
											)}
										</div>
									) : null}
									<p>
										{person.known_for_department === "Acting"
											? person.gender === 1
												? "Actress"
												: "Actor"
											: person.known_for_department === "Writing"
												? "Writer"
												: person.known_for_department === "Directing"
													? "Director"
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

					<Card className="relative overflow-hidden border-none">
						<CardHeader className="text-foreground">
							<CardTitle>Biography</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground gap-4">
							{person.biography ? (
								(() => {
									const [firstLine, ...rest] = person.biography.split("\n");
									const remainingText = rest.join("\n");

									if (!remainingText) {
										return <p>{firstLine}</p>;
									}

									return (
										<>
											<p>{firstLine}</p>
											<Collapsible
												open={isCollapsibleOpen}
												onOpenChange={setIsCollapsibleOpen}
											>
												<CollapsibleTrigger asChild>
													<Button variant="link" size="sm" className="p-0">
														{isCollapsibleOpen ? "Show less" : "Show more"}
													</Button>
												</CollapsibleTrigger>
												<CollapsibleContent>
													<p className="whitespace-pre-line">{remainingText}</p>
												</CollapsibleContent>
											</Collapsible>
										</>
									);
								})()
							) : (
								<p>No biography found for {person.name}.</p>
							)}
						</CardContent>

						{person.place_of_birth ? (
							<CardFooter>
								<div className="flex flex-wrap gap-2">
									<Badge
										variant="secondary"
										className="flex items-center gap-2"
									>
										Born in {person.place_of_birth}
									</Badge>
								</div>
							</CardFooter>
						) : null}
					</Card>
					{person.combined_credits ? (
						<MediasCarousel medias={sortedCredits} title="Known For" />
					) : null}
				</div>
			</div>
		</div>
	);
};

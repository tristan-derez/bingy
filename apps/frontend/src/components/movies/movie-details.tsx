import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	Clock,
	ExternalLink,
	Star,
} from "lucide-react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { TbMoneybag } from "react-icons/tb";
import Flag from "react-world-flags";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type {
	Company,
	Country,
	Genre,
	MovieCredits,
	MovieDetails,
} from "@/types/movie";
import { formatRuntime } from "@/utils/format-runtime";
import { shortenCountryName } from "@/utils/shorten-country-name";
import { LoadingCentered } from "../loading/loading-centered";
import { Separator } from "../ui/separator";

interface MovieDetailViewProps {
	movie: MovieDetails | undefined;
	credits: MovieCredits | undefined;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function MovieDetailView({
	movie,
	credits,
	isLoading,
	isError,
	onBack,
}: MovieDetailViewProps) {
	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError) {
		return (
			<div className="container mx-auto p-6">
				<Button onClick={onBack} className="mb-4" variant="outline">
					<ArrowLeft className="h-4 w-4" /> Back
				</Button>
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>Failed to load movie details</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (!movie) {
		return (
			<div className="container mx-auto p-6">
				<Button onClick={onBack} className="mb-4" variant="outline">
					<ArrowLeft className="h-4 w-4" /> Back
				</Button>
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Not Found</AlertTitle>
					<AlertDescription>Movie not found</AlertDescription>
				</Alert>
			</div>
		);
	}

	const crew = credits?.crew || [];

	const crewRolesMap = new Map<number, { name: string; roles: Set<string> }>();

	crew.forEach((person) => {
		let role: string | null = null;

		if (person.job === "Director") {
			role = "Director";
		} else if (person.department === "Writing") {
			role = person.job;
		}

		if (!role) return;

		const existing = crewRolesMap.get(person.id);
		if (existing) {
			existing.roles.add(role);
		} else {
			crewRolesMap.set(person.id, {
				name: person.name,
				roles: new Set([role]),
			});
		}
	});

	const crewWithRoles = Array.from(crewRolesMap.values());

	const imageUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
		: fallbackPoster;

	return (
		<div className="container mx-auto p-6">
			<Button onClick={onBack} className="mb-4" variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<div className="md:col-span-1">
					<img
						src={imageUrl}
						alt={movie.title}
						className="rounded-lg shadow-lg w-1/2 xl:w-full"
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
					/>
				</div>

				<div className="md:col-span-2 space-y-6">
					<div>
						<h1 className="text-4xl font-bold">{movie.title}</h1>
						{movie.tagline && (
							<p className="text-muted-foreground italic">{movie.tagline}</p>
						)}

						<div className="flex flex-wrap gap-2 mt-2">
							{movie.genres.map((genre: Genre) => (
								<Badge key={genre.id} variant="secondary">
									{genre.name}
								</Badge>
							))}
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Overview</CardTitle>
						</CardHeader>

						<CardContent className="space-y-4">
							<p>{movie.overview}</p>
							<Separator />
							{crewWithRoles.length > 0 && (
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
									{crewWithRoles.map((person) => (
										<div key={person.name}>
											<h3 className="font-semibold text-lg">{person.name}</h3>
											<p className="text-muted-foreground text-sm">
												{Array.from(person.roles).join(", ")}
											</p>
										</div>
									))}
								</div>
							)}
						</CardContent>

						<CardFooter>
							<div className="flex flex-wrap gap-2">
								{movie.production_countries.map((country: Country) => (
									<Badge
										key={country.iso_3166_1}
										variant="secondary"
										className="flex items-center gap-3"
									>
										<Flag
											code={country.iso_3166_1}
											style={{ width: 18, height: 14 }}
										/>
										<span>{shortenCountryName(country.name)}</span>
									</Badge>
								))}
							</div>
						</CardFooter>
					</Card>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<Card>
							<CardContent className="flex items-center gap-4">
								<Star className="h-5 w-5 text-yellow-500" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{movie.vote_count > 0
											? movie.vote_average.toFixed(1)
											: "No rating"}
									</p>
									<p className="text-sm text-muted-foreground">
										{movie.vote_count} votes
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center gap-4">
								<Calendar className="h-5 w-5" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{new Date(movie.release_date).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</p>
									<p className="text-sm text-muted-foreground">Release Date</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center gap-4">
								<Clock className="h-5 w-5" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{formatRuntime(movie.runtime)}
									</p>
									<p className="text-sm text-muted-foreground">Runtime</p>
								</div>
							</CardContent>
						</Card>

						{movie.budget > 0 && (
							<Card>
								<CardContent className="flex items-center gap-4">
									<TbMoneybag className="h-5 w-5" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											${movie.budget.toLocaleString()}
										</p>
										<p className="text-sm text-muted-foreground">Budget</p>
									</div>
								</CardContent>
							</Card>
						)}

						{movie.revenue > 0 && (
							<Card>
								<CardContent className="flex items-center gap-4">
									<FaMoneyBillTrendUp className="h-5 w-5" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											${movie.revenue.toLocaleString()}
										</p>
										<p className="text-sm text-muted-foreground">Revenue</p>
									</div>
								</CardContent>
							</Card>
						)}

						{movie.homepage && (
							<Card>
								<CardContent className=" flex items-center gap-4">
									<ExternalLink className="h-5 w-5" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											<a
												href={movie.homepage}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:underline"
											>
												Visit
											</a>
										</p>
										<p className="text-sm text-muted-foreground">Homepage</p>
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{movie.production_companies.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Production Companies</CardTitle>
							</CardHeader>

							<CardContent className="flex flex-wrap gap-4">
								{movie.production_companies.map((company: Company) => (
									<Badge
										key={company.id}
										className="flex items-center gap-3"
										variant="outline"
									>
										<span className="font-medium">{company.name}</span>
									</Badge>
								))}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}

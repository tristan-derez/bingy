import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Calendar, Clock, Star } from "lucide-react";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovie } from "@/hooks/useMovies";
import type { Genre } from "@/types/movie";
import { formatRuntime } from "@/utils/format-runtime";

export const Route = createFileRoute("/movies/$movieId")({
	component: MovieDetailsComponent,
});

function MovieDetailsComponent() {
	const router = useRouter();
	const { movieId } = Route.useParams();
	const { data, isLoading, isError } = useMovie(Number(movieId));

	if (isLoading) {
		return (
			<div className="container mx-auto p-6 space-y-4">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container mx-auto p-6">
				<Button
					onClick={() => router.history.back()}
					className="mb-4"
					variant={"outline"}
				>
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

	if (!data) {
		return (
			<div className="container mx-auto p-6">
				<Button
					onClick={() => router.history.back()}
					className="mb-4"
					variant={"outline"}
				>
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

	const imageUrl = data.poster_path
		? `https://image.tmdb.org/t/p/w500${data.poster_path}`
		: fallbackPoster;

	return (
		<div className="container mx-auto p-6">
			<Button
				onClick={() => router.history.back()}
				className="mb-4"
				variant={"outline"}
			>
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-1">
					<img
						src={imageUrl}
						alt={data.title}
						className="rounded-lg shadow-lg w-full"
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
					/>
				</div>
				<div className="md:col-span-2 space-y-4">
					<div>
						<h1 className="text-4xl font-bold">{data.title}</h1>
						{data.tagline && (
							<p className="text-muted-foreground italic">{data.tagline}</p>
						)}
					</div>

					<div className="flex flex-wrap gap-2">
						{data.genres.map((genre: Genre) => (
							<Badge key={genre.id} variant="secondary">
								{genre.name}
							</Badge>
						))}
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Overview</CardTitle>
						</CardHeader>
						<CardContent>
							<p>{data.overview}</p>
						</CardContent>
					</Card>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<Card>
							<CardContent className="pt-6 flex items-center gap-2">
								<Star className="h-5 w-5 text-yellow-500" />
								<div>
									<p className="text-2xl font-bold">
										{data.vote_count > 0
											? data.vote_average.toFixed(1)
											: "No rating"}
									</p>
									<p className="text-sm text-muted-foreground">
										{data.vote_count} votes
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6 flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								<div>
									<p className="text-2xl font-bold">
										{new Date(data.release_date).toLocaleDateString("en-US", {
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
							<CardContent className="pt-6 flex items-center gap-2">
								<Clock className="h-5 w-5" />
								<div>
									<p className="text-2xl font-bold">
										{formatRuntime(data.runtime)}
									</p>
									<p className="text-sm text-muted-foreground">Runtime</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

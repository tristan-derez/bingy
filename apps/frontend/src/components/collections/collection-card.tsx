import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useCollection } from "@/hooks/useCollection";
import { m } from "@/paraglide/messages";

interface CollectionCardProps {
	collection: Schemas.MovieDetails["belongs_to_collection"];
}

export function CollectionCard({ collection }: CollectionCardProps) {
	if (!collection) return null;

	const { data: collectionData } = useCollection(collection.id);
	if (!collectionData?.parts?.length) return null;

	const backgroundImage = collection.backdrop_path
		? `https://image.tmdb.org/t/p/original${collection.backdrop_path}`
		: undefined;

	return (
		<Card
			className="relative overflow-hidden min-h-[200px] justify-center text-dark-card-foreground"
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
				<CardTitle>{collection.name}</CardTitle>
				<CardDescription className="text-foreground">
					{m.collection_card_desc({
						numberOfMovies: collectionData.parts.length,
					})}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button
					variant="outline"
					className="w-full lg:w-1/2 xl:w-1/3 text-foreground"
				>
					<Link
						to="/collections/$collectionId"
						params={{ collectionId: collection.id.toString() }}
					>
						{m.btn_view_collection()}
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}

import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { useCollection } from "@/hooks/useCollections";
import type { Collection } from "@/types/collection";

interface CollectionCardProps {
	collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
	const { data: collectionData } = useCollection(collection.id);

	if (!collectionData?.parts?.length) return null;

	const backgroundImage = collection.backdrop_path
		? `https://image.tmdb.org/t/p/original${collection.backdrop_path}`
		: undefined;

	return (
		<Card
			className="relative overflow-hidden min-h-[200px] justify-center"
			style={
				backgroundImage
					? {
							backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${backgroundImage})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}
					: undefined
			}
		>
			<CardHeader>
				<CardTitle>{collection.name}</CardTitle>
				<CardDescription>
					Part of a collection with {collectionData.parts.length} movies
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Link
					to="/collections/$collectionId"
					params={{ collectionId: collection.id.toString() }}
				>
					<Button variant="secondary">VIEW THE COLLECTION</Button>
				</Link>
			</CardContent>
		</Card>
	);
}

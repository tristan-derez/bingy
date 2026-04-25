import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
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
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";

interface CollectionCardProps {
	collection: Schemas.MovieDetails["belongs_to_collection"];
}

export function CollectionCard({ collection }: CollectionCardProps) {
	const localeRegion = useAtomValue(localeRegionAtom);
	if (!collection) return null;

	const { data: collectionData } = useCollection(collection.id, {
		language: localeRegion,
	});

	if (!collectionData?.parts?.length) return null;

	const backgroundImage = collection.backdrop_path
		? `https://image.tmdb.org/t/p/original${collection.backdrop_path}`
		: undefined;

	return (
		<Card
			className="relative overflow-hidden min-h-[200px] ring-0 justify-center text-dark-card-foreground"
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
				<Link
					to="/collections/$collectionId"
					params={{ collectionId: collection.id.toString() }}
				>
					<Button
						variant="secondary"
						className="w-full md:w-xs text-foreground hover:cursor-pointer"
					>
						{m.btn_view_collection()}
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
}

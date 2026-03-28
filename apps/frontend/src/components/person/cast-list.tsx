import type { Schemas } from "shared";
import { CastHoverCard } from "@/components/person/cast-hover-card";

interface CastListProps {
	people: Array<Schemas.CastMember & { characters?: string[] }>;
}

export const CastList = ({ people }: CastListProps) => {
	if (!people.length) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{people.map((person) => (
				<CastHoverCard key={person.id} person={person} />
			))}
		</div>
	);
};

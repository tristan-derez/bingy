import type { Schemas } from "shared";
import { CrewHoverCard } from "./crew-hover-card";

interface CrewListProps {
	people: Array<Schemas.CrewMember & { jobs?: string[] }>;
}

export const CrewList = ({ people }: CrewListProps) => {
	if (!people.length) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{people.map((person) => (
				<CrewHoverCard key={person.id} person={person} />
			))}
		</div>
	);
};

import type { CastMember } from "@/types/person";
import { CastCard } from "./cast-card";

interface CastSectionProps {
	people: CastMember[];
	title?: string;
}

export const CastSection = ({ people, title = "Cast" }: CastSectionProps) => {
	const uniquePeople = Array.from(
		new Map(people.map((person) => [person.id, person])).values(),
	);

	if (!uniquePeople.length) {
		return null;
	}

	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-2xl font-bold">
				{title} ({uniquePeople.length})
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
				{uniquePeople.map((person) => (
					<CastCard key={person.id} person={person} />
				))}
			</div>
		</section>
	);
};

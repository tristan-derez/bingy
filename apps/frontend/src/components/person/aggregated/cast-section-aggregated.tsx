import type { Schemas } from "shared";
import { m } from "@/paraglide/messages";
import { CastCardAggregated } from "./cast-card-aggregated";

interface CastSectionAggregatedProps {
	people: Schemas.CastPersonInAggregatedTvCredits[];
	title?: string;
}

export const CastSectionAggregated = ({
	people,
	title = m.title_cast(),
}: CastSectionAggregatedProps) => {
	const uniquePeople = Array.from(
		new Map(people.map((person) => [person.id, person])).values(),
	);

	if (!uniquePeople.length) {
		return null;
	}

	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-2xl font-bold">
				{title} ({uniquePeople.length})
			</h2>
			<div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4 w-full">
				{uniquePeople.map((person) => (
					<CastCardAggregated key={person.id} person={person} />
				))}
			</div>
		</section>
	);
};

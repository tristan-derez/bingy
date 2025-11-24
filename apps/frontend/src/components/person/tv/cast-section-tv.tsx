import type { CastMemberForEpisode } from "@/types/person";
import { CastCardTv } from "./cast-card-tv";

interface CastSectionTvProps {
	people: CastMemberForEpisode[];
	title?: string;
}

export const CastSectionTv = ({
	people,
	title = "Cast",
}: CastSectionTvProps) => {
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
					<CastCardTv key={person.id} person={person} />
				))}
			</div>
		</section>
	);
};

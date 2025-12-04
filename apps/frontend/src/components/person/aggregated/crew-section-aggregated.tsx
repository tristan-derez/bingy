import type { Schemas } from "shared";
import { m } from "@/paraglide/messages";
import { CrewCardAggregated } from "./crew-card-aggregated";

interface CrewSectionAggregatedProps {
	people: Schemas.CrewPersonInAggregatedTvCredits[];
	title?: string;
}

export const CrewSectionAggregated = ({
	people,
	title = m.title_crew(),
}: CrewSectionAggregatedProps) => {
	const byDepartment = new Map<
		string,
		Map<number, Schemas.CrewPersonInAggregatedTvCredits>
	>();

	for (const person of people) {
		const department = person.department || "Other";

		let deptMap = byDepartment.get(department);
		if (!deptMap) {
			deptMap = new Map();
			byDepartment.set(department, deptMap);
		}

		const existing = deptMap.get(person.id);

		if (existing) {
			deptMap.set(person.id, {
				...existing,
				jobs: [...existing.jobs, ...person.jobs],
				total_episode_count:
					existing.total_episode_count + person.total_episode_count,
			});
		} else {
			deptMap.set(person.id, person);
		}
	}

	const uniqueIds = new Set(people.map((p) => p.id));
	const totalCount = uniqueIds.size;

	if (!totalCount) {
		return null;
	}

	return (
		<section className="flex flex-col gap-8">
			<h2 className="text-2xl font-bold">
				{title} ({totalCount})
			</h2>
			{Array.from(byDepartment.entries()).map(([department, peopleMap]) => {
				const deptPeople = Array.from(peopleMap.values());
				return (
					<div key={department} className="flex flex-col gap-4">
						<h3 className="text-xl font-semibold">{department}</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
							{deptPeople.map((person) => (
								<CrewCardAggregated
									key={`${department}-${person.id}`}
									person={person}
								/>
							))}
						</div>
					</div>
				);
			})}
		</section>
	);
};

import { useId } from "react";
import type { Schemas } from "shared";
import { m } from "@/paraglide/messages";
import type { TimelineItem } from "./department-container";
import { DepartmentContainer } from "./department-container";

interface PersonTimelineProps {
	combinedCredits: Schemas.PersonCombinedCredits;
}

export const PersonTimeline = ({ combinedCredits }: PersonTimelineProps) => {
	const id = useId();
	const actingItems = combinedCredits.cast.map(mapToTimelineItem);

	const crewByDepartment = combinedCredits.crew.reduce<
		Record<string, TimelineItem[]>
	>((acc, credit) => {
		const department = credit.department || "Other";
		if (!acc[department]) acc[department] = [];
		acc[department].push(mapToTimelineItem(credit));
		return acc;
	}, {});

	return (
		<div className="flex flex-col gap-2">
			{actingItems.length > 0 ? (
				<DepartmentContainer title="Acting" items={actingItems} />
			) : null}

			{Object.entries(crewByDepartment).map(([department, items]) => (
				<DepartmentContainer
					key={`${id}-${department}-dept`}
					title={department}
					items={items}
				/>
			))}
		</div>
	);
};

const extractDate = (
	credit: Schemas.MediaWithCastCredits | Schemas.MediaWithCrewCredits,
) =>
	"release_date" in credit
		? credit.release_date
		: "first_credit_air_date" in credit
			? credit.first_credit_air_date
			: null;

const mapToTimelineItem = (
	credit: Schemas.MediaWithCastCredits | Schemas.MediaWithCrewCredits,
): TimelineItem => {
	const dateStr = extractDate(credit);
	const date = dateStr ? new Date(dateStr) : null;

	const episodeCount =
		"episode_count" in credit ? (credit.episode_count as number) : undefined;
	const creditId = "credit_id" in credit ? credit.credit_id : undefined;

	return {
		id: credit.id,
		mediaType: credit.media_type,
		title: "title" in credit ? credit.title : credit.name,
		role:
			("character" in credit ? credit.character : "") ||
			("job" in credit ? credit.job : "") ||
			m.person_role_unknown(),
		year: date ? date.getFullYear().toString() : "N/A",
		fullDate: date ? date.toISOString() : null,
		episodeCount,
		creditId,
	};
};

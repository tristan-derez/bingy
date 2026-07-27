import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { TvDetailsView } from "@/components/tv/tv-details";
import { useTv } from "@/hooks/useTv";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute("/tv/$tvId")({
	component: TvDetailsContainer,
});

function TvDetailsContainer() {
	const { tvId } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	const {
		data: tv,
		isLoading,
		isError,
	} = useTv(Number(tvId), {
		append_to_response: "aggregate_credits,external_ids,watch/providers",
		language: localeRegion,
		region,
	});

	const cast: Array<Schemas.CastMember & { characters?: string[] }> =
		tv?.aggregate_credits?.cast?.slice(0, 20).map((member) => ({
			id: member.id,
			name: member.name,
			adult: member.adult,
			gender: member.gender,
			known_for_department: member.known_for_department,
			original_name: member.original_name,
			popularity: member.popularity,
			profile_path: member.profile_path,
			cast_id: member.id,
			character: member.roles?.[0]?.character || "",
			credit_id: member.roles?.[0]?.credit_id || "",
			order: member.order,
			characters:
				member.roles?.map((r) => r.character).filter(Boolean) || [],
		})) || [];

	const crew: Array<Schemas.CrewMember & { jobs?: string[] }> =
		tv?.aggregate_credits?.crew?.slice(0, 20).map((member) => ({
			id: member.id,
			name: member.name,
			adult: member.adult,
			gender: member.gender,
			known_for_department: member.known_for_department,
			department: member.department,
			original_name: member.original_name,
			popularity: member.popularity,
			profile_path: member.profile_path,
			credit_id: member.jobs?.[0]?.credit_id || "",
			job: member.jobs?.[0]?.job || "",
			jobs: member.jobs?.map((j) => j.job).filter(Boolean) || [],
		})) || [];

	const watchProviders = tv?.["watch/providers"];

	return (
		<TvDetailsView
			tv={tv}
			watchProviders={watchProviders}
			cast={cast}
			crew={crew}
			isLoading={isLoading}
			isError={isError}
		/>
	);
}

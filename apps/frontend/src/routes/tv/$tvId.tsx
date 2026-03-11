import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { TvDetailsView } from "@/components/tv/tv-details";
import { useTv } from "@/hooks/useTv";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";
import { getSocialUrls } from "@/utils/social-urls";

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

	const cast: Schemas.CastMember[] =
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
			character: member.roles?.[0]?.character || "Unknown",
			credit_id: member.roles?.[0]?.credit_id || "",
			order: member.order,
		})) || [];

	const socialUrls = tv?.external_ids ? getSocialUrls(tv.external_ids) : {};
	const watchProviders = tv?.["watch/providers"];

	return (
		<TvDetailsView
			tv={tv}
			watchProviders={watchProviders}
			socials={socialUrls}
			cast={cast}
			isLoading={isLoading}
			isError={isError}
		/>
	);
}

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { TvSeasonsDetailsView } from "@/components/tv/seasons/tv-seasons-details";
import { useTv } from "@/hooks/useTv";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute("/tv/$tvId_/seasons")({
	component: SeasonsPage,
});

function SeasonsPage() {
	const router = useRouter();
	const { tvId } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	const {
		data: tv,
		isLoading,
		isError,
	} = useTv(Number(tvId), { language: localeRegion, region });

	return (
		<TvSeasonsDetailsView
			tv={tv}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}

import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { z } from "zod";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { CreditEpisodesContainer } from "@/components/tv/episodes/credit-episodes/credit-episodes-container";
import { useCredit } from "@/hooks/useCredit";
import { localeRegionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute("/tv/$tvId_/episodes")({
	component: CreditEpisodesPage,
	validateSearch: z.object({
		credit_id: z.string().optional(),
	}),
	beforeLoad: ({ search }) => {
		if (!search.credit_id) {
			throw redirect({
				to: "..",
			});
		}
	},
});

function CreditEpisodesPage() {
	const { credit_id } = Route.useSearch();
	const localeRegion = useAtomValue(localeRegionAtom);

	const {
		data: creditDetails,
		isLoading,
		isError,
	} = useCredit(String(credit_id), { language: localeRegion });

	if (isLoading) {
		return <LoadingCentered />;
	}

	if (!creditDetails || isError) {
		return (
			<ResourceNotFound
				title="Something went wrong"
				description="The episodes you're looking for could not be found."
			/>
		);
	}

	return <CreditEpisodesContainer creditDetails={creditDetails} />;
}

import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { CreditEpisodesContainer } from "@/components/tv/episodes/credit-episodes/credit-episodes-container";
import { useCredit } from "@/hooks/useCredit";

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
	const router = useRouter();

	const {
		data: creditDetails,
		isLoading,
		isError,
	} = useCredit(String(credit_id));

	if (isLoading) {
		return <LoadingCentered />;
	}

	if (!creditDetails || isError) {
		return (
			<ResourceNotFound
				title="Something went wrong"
				description="The episodes you're looking for could not be found."
				onBack={() => router.history.back()}
			/>
		);
	}

	return (
		<CreditEpisodesContainer
			creditDetails={creditDetails}
			onBack={() => router.history.back()}
		/>
	);
}

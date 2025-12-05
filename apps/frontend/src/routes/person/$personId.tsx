import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { PersonDetailsView } from "@/components/person/person-details";
import { usePersonDetails } from "@/hooks/usePerson";
import { localeRegionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute("/person/$personId")({
	component: PersonPage,
});

function PersonPage() {
	const { personId } = Route.useParams();
	const router = useRouter();
	const localeRegion = useAtomValue(localeRegionAtom);

	const {
		data: person,
		isLoading,
		isError,
	} = usePersonDetails<Schemas.PersonDetailsWithCombinedCreditsAndSocials>(
		Number(personId),
		{
			append_to_response: "combined_credits,external_ids,translations",
			language: localeRegion,
		},
	);

	return (
		<PersonDetailsView
			person={person}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}

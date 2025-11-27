import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PersonDetailsView } from "@/components/person/person-details";
import { usePersonDetails } from "@/hooks/usePerson";
import type { PersonDetails } from "@/types/person";

export const Route = createFileRoute("/person/$personId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { personId } = Route.useParams();
	const router = useRouter();

	const {
		data: person,
		isLoading,
		isError,
	} = usePersonDetails<PersonDetails>(Number(personId), {
		append_to_response: "combined_credits,external_ids,translations",
		language: "en-US",
	});

	return (
		<PersonDetailsView
			person={person}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}

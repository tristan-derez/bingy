import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { fetchSearchMulti } from "@/api/search";
import { SearchResultsContainer } from "@/components/search/search-results-container";

const searchSchema = z.object({
	q: z.string(),
	language: z.string().optional().default("en-US"),
	page: z.number().optional().default(1),
});

// Create query options factory
const searchQueryOptions = (query: string, language: string, page: number) =>
	queryOptions({
		queryKey: ["search", "multi", query, language, page],
		queryFn: () => fetchSearchMulti(query, { language, page }),
		staleTime: 5 * 60 * 1000,
	});

export const Route = createFileRoute("/search")({
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => ({
		q: search.q,
		language: search.language,
		page: search.page,
	}),
	beforeLoad: ({ search }) => {
		if (!search.q) throw redirect({ to: ".." });
	},
	loader: async ({ deps: search, context }) => {
		await context.queryClient.ensureQueryData(
			searchQueryOptions(search.q, search.language, search.page),
		);

		return {
			q: search.q,
		};
	},
	component: SearchRoute,
	head: (ctx) => {
		return {
			meta: [
				{
					title: `Bingy - "${ctx.loaderData?.q}" search results`,
				},
				{
					name: "description",
					content: `Search results for "${ctx.loaderData?.q}" on Bingy.`,
				},
			],
		};
	},
});

function SearchRoute() {
	const router = useRouter();
	const { q, language, page } = Route.useSearch();
	const { data } = useSuspenseQuery(searchQueryOptions(q, language, page));

	return (
		<div className="container flex flex-col gap-4">
			<SearchResultsContainer
				results={data.results}
				language={language}
				query={q}
				onBack={() => router.history.back()}
			/>
		</div>
	);
}

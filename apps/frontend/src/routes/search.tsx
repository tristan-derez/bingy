import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { fetchSearchMulti } from "@/api/search";
import { SearchForm } from "@/components/forms/search-form";
import { SearchPagination } from "@/components/search/search-pagination";
import { SearchResultsContainer } from "@/components/search/search-results-container";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
	q: z.string(),
	language: z.string().optional().default("en-US"),
	page: z.number().optional().default(1),
});

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
			<Button
				onClick={() => router.history.back()}
				className="mb-4 max-w-20"
				variant="outline"
			>
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<SearchForm initialQuery={q} currentPage={page} />

			<SearchResultsContainer
				results={data.results}
				language={language}
				query={q}
			/>
			<SearchPagination
				currentPage={page}
				totalPages={data.total_pages}
				query={q}
				language={language}
			/>
		</div>
	);
}

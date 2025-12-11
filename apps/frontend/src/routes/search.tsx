import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { fetchSearchMulti } from "@/api/search";
import { SearchForm } from "@/components/forms/search-form";
import { SearchPagination } from "@/components/search/search-pagination";
import { SearchResultsContainer } from "@/components/search/search-results-container";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

const searchSchema = z.object({
	q: z.string().optional(),
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
	loader: async ({ deps: search, context }) => {
		if (!search.q) {
			return { q: undefined };
		}

		await context.queryClient.ensureQueryData(
			searchQueryOptions(search.q, search.language, search.page),
		);

		return { q: search.q };
	},
	component: SearchRoute,
	head: (ctx) => {
		const query = ctx.loaderData?.q;
		return {
			meta: [
				{
					title: query ? `Bingy - "${query}" search results` : "Bingy - Search",
				},
				{
					name: "description",
					content: query
						? `Search results for "${query}" on Bingy.`
						: "Search for movies, TV shows, and people on Bingy.",
				},
			],
		};
	},
});

function SearchRoute() {
	const router = useRouter();
	const { q, language, page } = Route.useSearch();

	const query = q
		? useSuspenseQuery(searchQueryOptions(q, language, page))
		: null;

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

			{q && query ? (
				<>
					<SearchResultsContainer results={query.data.results} query={q} />
					<SearchPagination
						currentPage={page}
						totalPages={query.data.total_pages}
						query={q}
						language={language}
					/>
				</>
			) : (
				<div className="text-center text-muted-foreground py-8">
					{m.form_search_no_query()}
				</div>
			)}
		</div>
	);
}

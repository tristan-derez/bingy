import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	redirect,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { fetchSearchMulti } from "@/api/search";
import { SearchResultsContainer } from "@/components/search/search-results-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchFormSchema } from "@/schemas/search-form-schema";

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
	const navigate = useNavigate({ from: Route.fullPath });

	const { q, language, page } = Route.useSearch();
	const [newQuery, setNewQuery] = useState(q);
	const [error, setError] = useState<string | null>(null);

	const { data } = useSuspenseQuery(searchQueryOptions(q, language, page));

	const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const result = searchFormSchema.safeParse({ newQuery });
		if (!result.success) {
			const firstIssue = result.error.issues[0];
			setError(firstIssue?.message ?? "Invalid input");
			return;
		}

		const trimmed = result.data.newQuery;
		navigate({ search: { q: trimmed, page: 1 } });
	};

	return (
		<div className="container flex flex-col gap-4">
			<Button
				onClick={() => router.history.back()}
				className="mb-4 max-w-20"
				variant="outline"
			>
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<form
				onSubmit={handleSearchSubmit}
				className="flex flex-col gap-1 w-full lg:max-w-[450px]"
			>
				<div className="flex gap-2">
					<Input
						type="text"
						value={newQuery}
						onChange={(e) => {
							const value = e.target.value;
							setNewQuery(value);

							if (
								error &&
								(error !== "Search cannot exceed 200 characters" ||
									value.length <= 200)
							) {
								setError(null);
							}
						}}
						placeholder="Search again..."
						className="flex rounded-md px-2 py-1"
					/>
					<Button
						type="submit"
						variant="secondary"
						className="bg-brand hover:bg-brand/95 px-4 py-1 rounded-md text-dark-card-foreground font-bold"
					>
						Search
					</Button>
				</div>
				{error ? <p className="text-red-500 text-sm">{error}</p> : null}
			</form>

			<SearchResultsContainer
				results={data.results}
				language={language}
				query={q}
			/>
		</div>
	);
}

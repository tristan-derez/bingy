import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchFormSchema } from "@/schemas/search-form-schema";

interface SearchFormProps {
	initialQuery: string;
	currentPage: number;
}

export function SearchForm({ initialQuery }: SearchFormProps) {
	const navigate = useNavigate();
	const [query, setQuery] = useState(initialQuery);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const result = searchFormSchema.safeParse({ newQuery: query });
		if (!result.success) {
			const firstIssue = result.error.issues[0];
			setError(firstIssue?.message ?? "Invalid input");
			return;
		}

		navigate({ to: "/search", search: { q: result.data.newQuery, page: 1 } });
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-1 w-full lg:max-w-[450px]"
		>
			<div className="flex gap-2">
				<Input
					type="text"
					value={query}
					onChange={(e) => {
						const value = e.target.value;
						setQuery(value);

						if (
							error &&
							(error !== "Search cannot exceed 300 characters" ||
								value.length <= 300)
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
	);
}

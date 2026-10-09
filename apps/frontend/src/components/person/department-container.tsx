import { Link } from "@tanstack/react-router";
import { useId } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { m } from "@/paraglide/messages";

export type TimelineItem = {
	id: number;
	mediaType: string;
	title: string;
	role: string;
	year: string;
	episodeCount?: number;
	creditId?: string;
	fullDate: string | null;
};

interface DepartmentContainerProps {
	title: string;
	items: TimelineItem[];
}

export const DepartmentContainer = ({
	title,
	items,
}: DepartmentContainerProps) => {
	const id = useId();
	const itemsByYear = items.reduce<Record<string, TimelineItem[]>>(
		(acc, item) => {
			const yearItems = (acc[item.year] ??= []);
			yearItems.push(item);
			return acc;
		},
		{},
	);

	const sortedYears = Object.keys(itemsByYear).sort((a, b) => {
		if (a === "N/A") return -1;
		if (b === "N/A") return 1;
		return Number(b) - Number(a);
	});

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-2xl font-bold">{title}</h2>

			<div className="flex flex-col gap-4">
				{sortedYears.map((year) => {
					const yearItems = itemsByYear[year];
					if (!yearItems) return null;

					const sortedItems = yearItems.sort((a, b) => {
						if (!a.fullDate && !b.fullDate) return 0;
						if (!a.fullDate) return 1;
						if (!b.fullDate) return -1;
						return (
							new Date(b.fullDate).getTime() - new Date(a.fullDate).getTime()
						);
					});

					return (
						<div key={`${id}-${year}`} className="flex flex-col gap-2">
							<div className="text-sm font-semibold text-muted-foreground">
								{year}
							</div>

							<Card className="shadow-none rounded-md border ring-0 py-4">
								<CardContent className="flex flex-col">
									{sortedItems.map((item, idx) => (
										<div
											key={item.creditId || `${id}-${item.id}-${idx}`}
											className="flex flex-col"
										>
											<Link
												to={
													item.mediaType.toLowerCase() === "movie"
														? "/movies/$movieId"
														: "/tv/$tvId"
												}
												params={
													item.mediaType.toLowerCase() === "movie"
														? { movieId: String(item.id) }
														: { tvId: String(item.id) }
												}
												className="font-bold text-md line-clamp-2 leading-relaxed"
											>
												{item.title}
											</Link>
											<div className="flex flex-row text-sm text-muted-foreground gap-1">
												{item.episodeCount !== undefined &&
												item.episodeCount > 0 ? (
													<Link
														to="/tv/$tvId/episodes"
														params={{ tvId: String(item.id) }}
														search={{ credit_id: String(item.creditId) }}
														className="underline text-foreground"
													>
														{item.episodeCount}{" "}
														{item.episodeCount > 1
															? m.department_container_episodes()
															: m.department_container_episode()}
													</Link>
												) : null}
												<div className="flex flex-row gap-1">
													<p>{m.person_as()}</p>
													<p>{item.role}</p>
												</div>
											</div>
											{idx < sortedItems.length - 1 && (
												<div className="py-2">
													<Separator />
												</div>
											)}
										</div>
									))}
								</CardContent>
							</Card>
						</div>
					);
				})}
			</div>
		</div>
	);
};

import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "../ui/separator";

export type TimelineItem = {
	id: number;
	mediaType: string;
	title: string;
	role: string;
	year: string;
	episodeCount?: number;
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
	const itemsByYear = items.reduce<Record<string, TimelineItem[]>>(
		(acc, item) => {
			if (!acc[item.year]) acc[item.year] = [];
			acc[item.year].push(item);
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
					const sortedItems = itemsByYear[year].sort((a, b) => {
						if (!a.fullDate && !b.fullDate) return 0;
						if (!a.fullDate) return 1;
						if (!b.fullDate) return -1;
						return (
							new Date(b.fullDate).getTime() - new Date(a.fullDate).getTime()
						);
					});

					return (
						<div key={year} className="flex flex-col gap-2">
							<div className="text-sm font-semibold text-muted-foreground">
								{year}
							</div>

							<Card className="shadow-none border-none rounded-md py-4">
								<CardContent className="flex flex-col">
									{sortedItems.map((item, idx) => (
										<div key={item.id} className="flex flex-col">
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

											<div className="text-sm text-muted-foreground">
												{item.episodeCount !== undefined
													? `${item.episodeCount} episode${item.episodeCount > 1 ? "s" : ""} `
													: ""}
												as {item.role}
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

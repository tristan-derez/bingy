import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { m } from "@/paraglide/messages";
import { getStars } from "@/utils/utils";

type RatingDistribution = {
	rating: number;
	count: number;
};

type ProfileRatingsSectionProps = {
	username: string;
};

const mockRatings: RatingDistribution[] = [
	{ rating: 0.5, count: 3 },
	{ rating: 1, count: 4 },
	{ rating: 1.5, count: 2 },
	{ rating: 2, count: 8 },
	{ rating: 2.5, count: 7 },
	{ rating: 3, count: 13 },
	{ rating: 3.5, count: 10 },
	{ rating: 4, count: 12 },
	{ rating: 4.5, count: 9 },
	{ rating: 5, count: 6 },
];

const chartConfig = {
	rating: {
		label: "Ratings",
	},
	count: {
		label: "Count",
	},
};

// todo: add the hook to fetch the real ratings from backend
export function ProfileRatingsSection({
	username,
}: ProfileRatingsSectionProps) {
	const totalRatings = mockRatings.reduce((sum, r) => sum + r.count, 0);

	return (
		<section className="flex flex-col gap-2">
			<div className="flex flex-row justify-between items-center">
				<h2 className="text-lg font-semibold">{m.profile_ratings_title()}</h2>
				<p className="text-sm text-muted-foreground">
					{m.profile_ratings_total({
						count: totalRatings,
					})}
				</p>
			</div>
			<div className="w-full">
				<ChartContainer config={chartConfig} className="h-24 w-full">
					<BarChart
						data={mockRatings}
						margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
					>
						<XAxis type="category" hide />
						<YAxis type="number" hide />
						<ChartTooltip
							content={({ active, payload }) => {
								if (!active || !payload?.length) return null;
								const data = payload[0];
								const rating = Number(data.payload.rating);
								const count = Number(data.value);
								return (
									<div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
										{m.profile_ratings_tooltip({
											count,
											stars: getStars(rating),
										})}
									</div>
								);
							}}
						/>
						<Bar
							dataKey="count"
							radius={4}
							shape={(props: any) => {
								const {
									isActive,
									dataKey,
									tooltipPosition,
									stackedBarStart,
									parentViewBox,
									originalDataIndex,
									...rest
								} = props;
								return <rect {...rest} fill={"var(--color-brand)"} />;
							}}
						/>
					</BarChart>
				</ChartContainer>
			</div>
		</section>
	);
}

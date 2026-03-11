import type { Schemas } from "shared";
import { shortenCountryName } from "@/utils/shorten-country-name";
import { Badge } from "../ui/badge";

interface ProductionCountriesBadgeProps {
	countries: Schemas.ProductionCountry[];
	variant?: "outline" | "secondary" | "default" | "destructive";
}

export function ProductionCountriesBadge({
	countries,
	variant = "default",
}: ProductionCountriesBadgeProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{countries.map((country) => (
				<Badge
					key={country.iso_3166_1}
					variant={variant}
					className="flex items-center gap-2"
				>
					<span
						className={`fi fi-${country.iso_3166_1.toLowerCase()}`}
						style={{ width: 18, height: 14 }}
					/>
					<span className="font-medium">
						{shortenCountryName(country.name)}
					</span>
				</Badge>
			))}
		</div>
	);
}

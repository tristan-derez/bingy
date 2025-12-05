import { useAtomValue, useSetAtom } from "jotai";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeAtom, setLocaleAtom } from "@/lib/atoms/locale";
import { regionAtom, SUPPORTED_REGIONS } from "@/lib/atoms/region";
import { locales } from "@/paraglide/runtime";

const REGION_NAMES: Record<string, string> = {
	FR: "France",
	CA: "Canada",
	US: "United States",
	GB: "United Kingdom",
	AU: "Australia",
};

export const LocaleRegionDropdown = () => {
	const locale = useAtomValue(localeAtom);
	const region = useAtomValue(regionAtom);
	const changeLocale = useSetAtom(setLocaleAtom);
	const changeRegion = useSetAtom(regionAtom);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Globe className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Display Language</DropdownMenuLabel>
				{locales.map((tag) => (
					<DropdownMenuItem
						key={tag}
						onClick={() => changeLocale(tag)}
						className={locale === tag ? "bg-accent" : ""}
					>
						{tag.toUpperCase()}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Content Region</DropdownMenuLabel>
				{SUPPORTED_REGIONS.map((reg) => (
					<DropdownMenuItem
						key={reg}
						onClick={() => changeRegion(reg)}
						className={region === reg ? "bg-accent" : ""}
					>
						{REGION_NAMES[reg]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

import { IconLanguage } from "@tabler/icons-react";
import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeAtom, setLocaleAtom } from "@/lib/atoms/locale";
import { regionAtom, SUPPORTED_REGIONS } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { locales } from "@/paraglide/runtime";

const getRegionName = (region: string): string => {
	switch (region) {
		case "FR":
			return m.region_france();
		case "CA":
			return m.region_canada();
		case "US":
			return m.region_united_states();
		case "GB":
			return m.region_united_kingdom();
		case "AU":
			return m.region_australia();
		default:
			return region;
	}
};

export const LocaleRegionDropdown = () => {
	const locale = useAtomValue(localeAtom);
	const region = useAtomValue(regionAtom);
	const changeLocale = useSetAtom(setLocaleAtom);
	const changeRegion = useSetAtom(regionAtom);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="icon" aria-label="language">
						<IconLanguage />
					</Button>
				}
			/>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuLabel>{m.locale_dropdown_label()}</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={locale} onValueChange={changeLocale}>
						{locales.map((tag) => (
							<DropdownMenuRadioItem key={tag} value={tag}>
								{tag.toUpperCase()}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>{m.region_dropdown_label()}</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={region} onValueChange={changeRegion}>
						{SUPPORTED_REGIONS.map((reg) => (
							<DropdownMenuRadioItem key={reg} value={reg}>
								{getRegionName(reg)}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

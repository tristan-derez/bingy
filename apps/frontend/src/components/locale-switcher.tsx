import { useAtomValue, useSetAtom } from "jotai";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { localeAtom, setLocaleAtom } from "@/lib/atoms/locale";
import { locales } from "@/paraglide/runtime";

export const LocaleSwitcher = () => {
	const locale = useAtomValue(localeAtom);
	const changeLocale = useSetAtom(setLocaleAtom);

	return (
		<Select value={locale} onValueChange={changeLocale}>
			<SelectTrigger>
				<SelectValue placeholder="Language" />
			</SelectTrigger>
			<SelectContent align="end">
				{locales.map((tag) => (
					<SelectItem key={tag} value={tag}>
						{tag.toUpperCase()}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

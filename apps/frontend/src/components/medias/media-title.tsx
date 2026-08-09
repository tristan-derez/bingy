import { getYear } from "date-fns";

type MediaTitleProps = {
	title: string;
	releaseDate?: string | null;
	originalTitle?: string;
	hasDifferentTitle: boolean;
};

export function MediaTitle({
	title,
	releaseDate,
	originalTitle,
	hasDifferentTitle,
}: MediaTitleProps) {
	return (
		<h1 className="flex flex-wrap items-end gap-x-2 min-w-0 text-2xl lg:text-4xl font-bold leading-none">
			{title}
			{releaseDate ? (
				<span className="text-lg lg:text-2xl font-normal underline">
					{getYear(releaseDate)}
				</span>
			) : null}
			{hasDifferentTitle ? (
				<span className="text-foreground text-base lg:text-xl font-bold italic">
					— {originalTitle}
				</span>
			) : null}
		</h1>
	);
}

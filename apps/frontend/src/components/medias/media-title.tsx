import { getYear } from "date-fns";
import { normalizeTitle } from "@/utils/utils";

type MediaTitleProps = {
	title: string;
	releaseDate?: string | null;
	originalTitle: string;
};

export function MediaTitle({
	title,
	releaseDate,
	originalTitle,
}: MediaTitleProps) {
	const year = releaseDate ? getYear(releaseDate) : null;
	const hasDifferentTitleInVO =
		normalizeTitle(originalTitle) !== normalizeTitle(title);

	return (
		<h1 className="w-full text-2xl lg:text-4xl font-bold leading-tight">
			{title} <ReleaseYear year={year} />
			<OriginalTitle title={originalTitle} visible={hasDifferentTitleInVO} />
		</h1>
	);
}

function ReleaseYear({ year }: { year: number | null }) {
	return year !== null ? (
		<span className="text-lg lg:text-2xl font-normal underline">{year}</span>
	) : null;
}

function OriginalTitle({
	title,
	visible,
}: {
	title?: string;
	visible: boolean;
}) {
	return visible ? (
		<span className="text-foreground text-base lg:text-xl font-normal italic">
			{" "}
			— {title}
		</span>
	) : null;
}

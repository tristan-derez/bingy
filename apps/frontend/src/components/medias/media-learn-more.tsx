import { IconExternalLink } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { m } from "@/paraglide/messages";

interface MediaLearnMoreProps {
	id: number;
	mediaType: "movie" | "tv";
}

export function MediaLearnMoreCard({ id, mediaType }: MediaLearnMoreProps) {
	const tmdbUrl = `https://www.themoviedb.org/${mediaType}/${id}`;

	return (
		<Card>
			<CardContent className=" flex items-center gap-4">
				<IconExternalLink />
				<div>
					<p className="text-xl xl:text-2xl font-bold">
						<a
							href={tmdbUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							{m.btn_media_learn_more()}
						</a>
					</p>
					<p className="text-sm text-muted-foreground">
						{m.media_details_learn_more()}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

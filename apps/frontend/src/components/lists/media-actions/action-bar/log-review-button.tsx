import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

interface LogReviewButtonProps {
	existingRating?: boolean;
	onClick: () => void;
}

export function LogReviewButton({
	existingRating,
	onClick,
}: LogReviewButtonProps) {
	return (
		<Button variant="ghost" onClick={onClick}>
			{existingRating
				? m.btn_log_review_existing_rating()
				: m.btn_log_review_text()}
		</Button>
	);
}

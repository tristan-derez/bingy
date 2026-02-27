import { IconBrandX, IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

export function ShareButton({ url, text }: { url: string; text?: string }) {
	const [isHovered, setIsHovered] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleXShare = () => {
		const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || "")}&url=${encodeURIComponent(url)}`;
		window.open(shareUrl, "_blank");
	};

	return (
		<div
			className="relative w-full"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Button variant="ghost" className="w-full" onClick={handleCopy}>
				{copied ? m.btn_copied_text() : m.btn_share_text()}
			</Button>

			{isHovered && (
				<div className="absolute inset-0 flex items-center justify-between bg-background px-3 border rounded-lg shadow-sm">
					<span className="text-xs truncate text-muted-foreground flex-1 mr-2">
						{url}
					</span>
					<div className="flex gap-1">
						<Button variant="ghost" size="icon-xs" onClick={handleCopy}>
							<IconCopy className="size-4" />
						</Button>
						<Button variant="ghost" size="icon-xs" onClick={handleXShare}>
							<IconBrandX className="size-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

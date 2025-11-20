import { FaInstagram, FaSquareFacebook, FaXTwitter } from "react-icons/fa6";

const SOCIAL_ICONS = {
	facebook: FaSquareFacebook,
	instagram: FaInstagram,
	twitter: FaXTwitter,
} as const;

type SocialKey = keyof typeof SOCIAL_ICONS;

interface SocialsProps {
	socials: Partial<Record<SocialKey, string>>;
}

export function SocialLinks({ socials }: SocialsProps) {
	return (
		<div className="flex gap-4">
			{(Object.entries(socials) as [SocialKey, string][]).map(([key, url]) => {
				const Icon = SOCIAL_ICONS[key];
				return (
					<a
						key={key}
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-2xl hover:text-chart-3 transition-colors"
					>
						<Icon />
					</a>
				);
			})}
		</div>
	);
}

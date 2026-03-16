import type { Schemas } from "shared";
import { m } from "@/paraglide/messages";

interface WatchProvidersSectionProps {
	watchProviders: Schemas.WatchProviders | undefined;
	region?: Schemas.WatchProvidersCountry;
	className?: string;
	maxProviders?: number;
	title?: string;
}

export function WatchProvidersSection({
	watchProviders,
	region = "US",
	className,
	maxProviders = 1,
	title,
}: WatchProvidersSectionProps) {
	const providers = watchProviders?.results[region];

	if (!providers?.flatrate?.length) {
		return null;
	}

	const displayedProviders = providers.flatrate.slice(0, maxProviders);

	return (
		<div className={className}>
			{title ? (
				<div>
					<div className="text-lg font-semibold">{title}</div>
				</div>
			) : null}
			<div className="flex flex-row justify-center">
				{displayedProviders.map((provider) => {
					const providerName =
						provider.provider_name === "Amazon Prime Video"
							? "Prime Video"
							: provider.provider_name;

					return (
						<a
							key={provider.provider_id}
							href={providers.link}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 hover:opacity-80 transition-opacity pb-3 text-dark-card-foreground"
						>
							{provider.logo_path && (
								<img
									src={
										provider.logo_path
											? `https://image.tmdb.org/t/p/original${provider.logo_path}`
											: undefined
									}
									alt={providerName}
									className="w-10 h-10 rounded"
								/>
							)}
							<div className="flex flex-col h-10 justify-center">
								<span className="text-sm leading-relaxed">
									{m.watch_providers_text()}
								</span>
								<span className="text-base font-bold leading-relaxed">
									{providerName}
								</span>
							</div>
						</a>
					);
				})}
			</div>
		</div>
	);
}

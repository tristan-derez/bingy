import backgroundPlaceholder from "@/assets/media-backdrop-placeholder.jpg";

interface ProfileBannerProps {
	backgroundImage: string | null;
}

export function ProfileBanner({ backgroundImage }: ProfileBannerProps) {
	const bgColor = "var(--background)";

	return (
		<div
			className="absolute top-0 left-0 right-0 mx-auto w-full
				max-w-full md:max-w-[480px] lg:max-w-[640px] xl:max-w-[711px]
				h-[180px] md:h-[270px] lg:h-[360px] xl:h-[400px]
				-z-10 overflow-hidden"
		>
			<img
				src={backgroundImage ?? backgroundPlaceholder}
				alt=""
				className="absolute inset-0 w-full h-full object-cover"
			/>

			<div
				className="absolute inset-0"
				style={{
					background: `radial-gradient(
						circle at center, 
						transparent 0%, 
						${bgColor} 85%
					)`,
				}}
			/>

			<div
				className="absolute inset-0"
				style={{
					background: `linear-gradient(to bottom, transparent 40%, ${bgColor} 100%)`,
				}}
			/>
		</div>
	);
}

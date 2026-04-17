import backgroundPlaceholder from "@/assets/media-backdrop-placeholder.jpg";

interface ProfileBannerProps {
	backgroundImage: string | null;
}

export function ProfileBanner({ backgroundImage }: ProfileBannerProps) {
	const bgColor = "var(--background)";

	return (
		<div
			className="absolute top-0 left-1/2 -translate-x-1/2 w-full ring-0 border-none shadow-none
				max-w-full md:max-w-[480px] lg:max-w-[640px] xl:max-w-[711px]
				h-[180px] md:h-[270px] lg:h-[360px] xl:h-[400px]
				-z-10 overflow-hidden"
		>
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `url(${backgroundImage ?? backgroundPlaceholder})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
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

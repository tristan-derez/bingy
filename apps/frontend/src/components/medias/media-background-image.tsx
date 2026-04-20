import backgroundPlaceholder from "@/assets/media-backdrop-placeholder.jpg";

interface MediaBackgroundImageProps {
	backgroundImage: string | null;
}

export function MediaBackgroundImage({
	backgroundImage,
}: MediaBackgroundImageProps) {
	const bgColor = "var(--background)";

	return (
		<div className="absolute top-14 lg:top-0 left-1/2 -translate-x-1/2 w-full ring-0 border-none shadow-none max-w-xl lg:max-w-7xl h-[300px] lg:h-[450px] -z-10 overflow-hidden">
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `url(${backgroundImage ?? backgroundPlaceholder})`,
					backgroundSize: "100%",
					backgroundPosition: "initial",
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

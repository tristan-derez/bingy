interface MediaBackgroundImageProps {
	backgroundImage: string | null;
}

export function MediaBackgroundImage({
	backgroundImage,
}: MediaBackgroundImageProps) {
	const bgColor = "var(--background)";

	return (
		<>
			{backgroundImage ? (
				<div className="absolute top-0 w-full ring-0 border-none shadow-none max-w-screen-2xl h-[450px] lg:h-[600px] -z-10  overflow-hidden">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `url(${backgroundImage})`,
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
			) : null}
		</>
	);
}

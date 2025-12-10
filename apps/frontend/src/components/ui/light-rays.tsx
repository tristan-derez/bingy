import { type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface LightRaysProps extends React.HTMLAttributes<HTMLDivElement> {
	ref?: React.Ref<HTMLDivElement>;
	count?: number;
	color?: string;
	blur?: number;
	length?: string;
}

export function LightRays({
	className,
	style,
	count = 7,
	color = "rgba(160, 210, 255, 0.2)",
	blur = 36,
	length = "70vh",
	ref,
	...props
}: LightRaysProps) {
	return (
		<div
			ref={ref}
			className={cn(
				"pointer-events-none fixed inset-0 isolate overflow-hidden rounded-[inherit]",
				className,
			)}
			style={
				{
					"--light-rays-color": color,
					"--light-rays-blur": `${blur}px`,
					"--light-rays-length": length,
					...style,
				} as CSSProperties
			}
			{...props}
		>
			<div className="absolute inset-0 overflow-hidden">
				<div
					aria-hidden
					className="absolute inset-0 opacity-60"
					style={
						{
							background:
								"radial-gradient(circle at 20% 15%, color-mix(in srgb, var(--light-rays-color) 45%, transparent), transparent 70%)",
						} as CSSProperties
					}
				/>
				<div
					aria-hidden
					className="absolute inset-0 opacity-60"
					style={
						{
							background:
								"radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--light-rays-color) 35%, transparent), transparent 75%)",
						} as CSSProperties
					}
				/>

				{Array.from({ length: count }, (_, i) => {
					const left = 8 + Math.random() * 84;
					const rotate = -28 + Math.random() * 56;
					const width = 160 + Math.random() * 160;
					const intensity = 0.6 + Math.random() * 0.5;

					return (
						<div
							key={i}
							className="pointer-events-none absolute -top-[12%] h-[var(--light-rays-length)] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-[color-mix(in_srgb,var(--light-rays-color)_70%,transparent)] to-transparent mix-blend-screen blur-[var(--light-rays-blur)]"
							style={
								{
									left: `${left}%`,
									width: `${width}px`,
									transform: `translateX(-50%) rotate(${rotate}deg)`,
									opacity: intensity,
								} as CSSProperties
							}
						/>
					);
				})}
			</div>
		</div>
	);
}

import { Link } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
	items: {
		name: string;
		link?: string;
		icon?: React.ReactNode;
		onClick?: () => void;
	}[];
	className?: string;
}

export const MobileBottomNav = ({ items, className }: BottomNavProps) => {
	const { scrollY } = useScroll();
	const [visible, setVisible] = useState(true);
	const prevScrollY = useRef(0);

	useMotionValueEvent(scrollY, "change", (latest) => {
		const isScrollingUp = latest < prevScrollY.current;
		const isAtTop = latest < 100;

		if (isAtTop) {
			setVisible(true);
		} else {
			setVisible(isScrollingUp);
		}

		prevScrollY.current = latest;
	});

	return (
		<motion.nav
			initial={{ y: 100 }}
			animate={{ y: visible ? 0 : 100 }}
			transition={{
				type: "spring",
				stiffness: 300,
				damping: 30,
				mass: 0.8,
			}}
			className={cn("fixed bottom-0 left-0 right-0 z-50 lg:hidden", className)}
		>
			<div className="flex items-center justify-around rounded-t-lg border py-4 px-4 border-border bg-card/70 backdrop-blur-lg shadow-sm">
				{items.map((item) =>
					item.onClick ? (
						<button
							key={item.name}
							type="button"
							onClick={item.onClick}
							className="flex flex-col items-center gap-1 px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
						>
							<span className="text-xl">{item.icon}</span>
						</button>
					) : (
						<Link
							key={item.name}
							to={item.link}
							className="flex flex-col items-center gap-1 px-2 py-1 text-muted-foreground transition-colors [&.active]:text-foreground"
						>
							<span className="text-xl">{item.icon}</span>
						</Link>
					),
				)}
			</div>
		</motion.nav>
	);
};

interface MobileTopBarProps {
	left: React.ReactNode;
	center: React.ReactNode;
	right: React.ReactNode;
	className?: string;
}

export const MobileTopBar = ({
	left,
	center,
	right,
	className,
}: MobileTopBarProps) => {
	return (
		<div
			className={cn(
				"absolute top-0 left-0 right-0 z-40 lg:hidden",
				"px-5 md:px-6 py-2",
				className,
			)}
		>
			<div className="flex items-center justify-between rounded-md border border-border bg-card/50 backdrop-blur-lg px-4 py-2 shadow-sm">
				<div className="flex-1">{left}</div>
				<div className="flex-shrink-0">{center}</div>
				<div className="flex-1 flex justify-end">{right}</div>
			</div>
		</div>
	);
};

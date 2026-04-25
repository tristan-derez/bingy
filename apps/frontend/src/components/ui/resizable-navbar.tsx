import { Link } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import React, { useRef, useState } from "react";
import logo from "@/assets/bingy-icon.svg";
import logoFull from "@/assets/bingy-icon_text.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
	children: React.ReactNode;
	className?: string;
}

interface NavBodyProps {
	children: React.ReactNode;
	className?: string;
	visible?: boolean;
}

interface NavItemsProps {
	items: {
		name: string;
		link?: string;
		icon?: React.ReactNode;
		onClick?: () => void;
		cursorClass?: string;
	}[];
	className?: string;
	onItemClick?: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollY } = useScroll();
	const [visible, setVisible] = useState(false);

	useMotionValueEvent(scrollY, "change", (latest) => {
		setVisible(latest > 100);
	});

	return (
		<motion.div
			ref={ref}
			initial={{ top: 0 }}
			animate={{ top: 30 }}
			transition={{ type: "tween", stiffness: 350 }}
			className={cn(
				"fixed top-0 left-1/2 -translate-x-1/2 z-99 w-full px-5 md:px-6 lg:px-28 xl:px-30 2xl:px-80",
				visible && "",
				className,
			)}
		>
			{React.Children.map(children, (child) =>
				React.isValidElement(child)
					? React.cloneElement(
							child as React.ReactElement<{ visible?: boolean }>,
							{ visible },
						)
					: child,
			)}
		</motion.div>
	);
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
	return (
		<motion.div
			animate={{
				backdropFilter: visible ? "blur(10px)" : "none",
				boxShadow: visible
					? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
					: "none",
				width: visible ? "70%" : "100%",
			}}
			transition={{
				type: "tween",
				stiffness: 350,
				damping: 50,
			}}
			className={cn(
				"relative z-60 hidden w-full min-w-[768px] max-w-full flex-row items-center justify-between self-start rounded-full mx-auto lg:flex",
				visible
					? "border-none bg-card/70 backdrop-blur-lg shadow-sm px-4 py-2"
					: "",
				className,
			)}
		>
			{children}
		</motion.div>
	);
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
	const [hovered, setHovered] = useState<number | null>(null);

	return (
		<motion.div
			onMouseLeave={() => setHovered(null)}
			className={cn(
				"hidden flex-row items-center justify-center text-sm font-medium transition duration-200 lg:flex",
				className,
			)}
		>
			{items.map((item, idx) =>
				item.onClick ? (
					<button
						key={item.name}
						type="button"
						onMouseEnter={() => setHovered(idx)}
						onClick={item.onClick}
						className={cn("relative px-2 py-2 flex items-center gap-1", item.cursorClass ?? "hover:cursor-pointer")}
					>
						{hovered === idx && (
							<motion.div
								layoutId="hovered"
								className="absolute inset-0 h-full w-full rounded-full bg-brand"
							/>
						)}
						{item.icon ? (
							<span className="relative z-20">{item.icon}</span>
						) : null}
						<span className="relative z-20">{item.name}</span>
					</button>
				) : (
					<Link
						key={item.name}
						to={item.link}
						onMouseEnter={() => setHovered(idx)}
						onClick={onItemClick}
						className="relative px-4 py-2 flex items-center gap-1 [&.active]:font-bold"
					>
						{hovered === idx && (
							<motion.div
								layoutId="hovered"
								className="absolute inset-0 h-full w-full rounded-full bg-brand"
							/>
						)}
						{item.icon ? (
							<span className="relative z-20">{item.icon}</span>
						) : null}
						<span className="relative z-20">{item.name}</span>
					</Link>
				),
			)}
		</motion.div>
	);
};

export const NavbarLogo = () => {
	return (
		<Link to="/">
			<img src={logoFull} alt="Logo" className="h-6 w-auto" />
		</Link>
	);
};

export const MobileNavbarLogo = () => {
	return (
		<Link to="/">
			<img src={logo} alt="Logo" className="h-6 w-auto" />
		</Link>
	);
};

export const NavbarButton = ({
	to,
	children,
	className,
	variant = "default",
	size = "default",
	...props
}: {
	to: string;
	children: React.ReactNode;
} & VariantProps<typeof buttonVariants> &
	React.ComponentPropsWithoutRef<typeof Link>) => {
	return (
		<Link to={to} {...props}>
			<Button
				variant={variant}
				size={size}
				className={cn("cursor-pointer", className)}
			>
				{children}
			</Button>
		</Link>
	);
};

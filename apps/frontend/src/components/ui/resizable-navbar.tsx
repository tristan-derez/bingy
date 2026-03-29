import { Link } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import React, { useRef, useState } from "react";
import logo from "@/assets/bingy-icon.svg";
import logoFull from "@/assets/bingy-icon_text.svg";
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
				"hidden flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-200 lg:flex",
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
						className="relative px-4 py-2 flex items-center gap-2 hover:cursor-pointer"
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
						className="relative px-4 py-2 flex items-center gap-2 [&.active]:font-bold"
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
	variant = "primary",
	...props
}: {
	to: string;
	children: React.ReactNode;
	className?: string;
	variant?: "primary" | "secondary" | "dark" | "gradient";
} & React.ComponentPropsWithoutRef<typeof Link>) => {
	const baseStyles =
		"px-4 py-2 rounded-md bg-white button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

	const variantStyles = {
		primary:
			"shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
		secondary: "bg-transparent shadow-none text-foreground",
		dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
		gradient:
			"bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
	};

	return (
		<Link
			to={to}
			className={cn(baseStyles, variantStyles[variant], className)}
			{...props}
		>
			{children}
		</Link>
	);
};

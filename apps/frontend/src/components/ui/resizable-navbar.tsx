import { Link } from "@tanstack/react-router";
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useScroll,
} from "motion/react";
import React, { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
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
		link: string;
	}[];
	className?: string;
	onItemClick?: () => void;
}

interface MobileNavProps {
	children: React.ReactNode;
	className?: string;
	visible?: boolean;
}

interface MobileNavHeaderProps {
	children: React.ReactNode;
	className?: string;
}

interface MobileNavMenuProps {
	children: React.ReactNode;
	className?: string;
	isOpen: boolean;
	onClose: () => void;
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
			animate={{ top: visible ? 30 : 0 }}
			transition={{ type: "tween", stiffness: 350 }}
			className={cn(
				"fixed top-0 inset-x-0 z-99 w-full px-2 md:px-6 lg:px-12 2xl:px-32",
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
				width: visible ? "80%" : "100%",
			}}
			transition={{
				type: "tween",
				stiffness: 350,
				damping: 50,
			}}
			style={{
				backgroundColor: "inherit",
			}}
			className={cn(
				"relative z-[60] hidden w-full min-w-[600px] max-w-full mx-auto flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex",
				visible && "bg-card",
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
				"hidden flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-card lg:flex lg:space-x-2",
				className,
			)}
		>
			{items.map((item, idx) => (
				<Link
					to={item.link}
					onMouseEnter={() => setHovered(idx)}
					onClick={onItemClick}
					className="relative px-4 py-2 text-foreground [&.active]:font-bold"
					key={`link-${item.name}`}
				>
					{hovered === idx && (
						<motion.div
							layoutId="hovered"
							className="absolute inset-0 h-full w-full rounded-full bg-card"
						/>
					)}
					<span className="relative z-20">{item.name}</span>
				</Link>
			))}
		</motion.div>
	);
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
	return (
		<motion.div
			animate={{
				backdropFilter: visible ? "blur(10px)" : "none",
				boxShadow: visible
					? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
					: "none",
				width: visible ? "90%" : "100%",
				paddingRight: visible ? "12px" : "0px",
				paddingLeft: visible ? "12px" : "0px",
				borderRadius: visible ? "8px" : "2rem",
				y: visible ? 20 : 0,
			}}
			transition={{
				type: "spring",
				stiffness: 200,
				damping: 50,
			}}
			className={cn(
				"relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
				visible && "bg-card",
				className,
			)}
		>
			{children}
		</motion.div>
	);
};

export const MobileNavHeader = ({
	children,
	className,
}: MobileNavHeaderProps) => {
	return (
		<div
			className={cn(
				"flex w-full flex-row items-center justify-between",
				className,
			)}
		>
			{children}
		</div>
	);
};

export const MobileNavMenu = ({
	children,
	className,
	isOpen,
}: MobileNavMenuProps) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className={cn(
						"absolute inset-x-0 top-12 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg p-4 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] bg-card",
						className,
					)}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export const MobileNavToggle = ({
	isOpen,
	onClick,
}: {
	isOpen: boolean;
	onClick: () => void;
}) => {
	return isOpen ? (
		<IoCloseSharp className="text-foreground text-2xl" onClick={onClick} />
	) : (
		<LuMenu className="text-foreground text-2xl" onClick={onClick} />
	);
};

export const NavbarLogo = () => {
	return (
		<Link to="/">
			<img src={logoFull} alt="Logo" className="h-6 w-auto" />
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

import { Link, useRouteContext } from "@tanstack/react-router";

import { useState } from "react";
import { ProfileDropdown } from "./profile-dropdown";
import { SearchCombobox } from "./search/search-combobox";
import {
	MobileNav,
	MobileNavHeader,
	MobileNavMenu,
	MobileNavToggle,
	NavBody,
	Navbar,
	NavbarButton,
	NavbarLogo,
	NavItems,
} from "./ui/resizable-navbar";
import { Separator } from "./ui/separator";

export default function Header() {
	const { session } = useRouteContext({ from: "__root__" });
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const allNavItems = [
		{
			name: "Home",
			link: "/",
			requiresAuth: false,
			hideWhenAuth: true,
		},
		{
			name: "Dashboard",
			link: "/dashboard",
			requiresAuth: true,
			hideWhenAuth: false,
		},
		{
			name: "Features",
			link: "/features" as const,
			requiresAuth: false,
			hideWhenAuth: true,
		},
		{
			name: "Contact",
			link: "/contact" as const,
			requiresAuth: false,
			hideWhenAuth: true,
		},
		{
			name: "Movies",
			link: "/movies" as const,
			requiresAuth: true,
			hideWhenAuth: false,
		},
		{
			name: "TV",
			link: "/tv" as const,
			requiresAuth: true,
			hideWhenAuth: false,
		},
	] as const;

	const navItems = allNavItems.filter((item) => {
		if (item.requiresAuth && !session) return false;
		if (item.hideWhenAuth && session) return false;
		return true;
	});

	return (
		<Navbar>
			<NavBody>
				<NavbarLogo />
				<div className="flex items-center gap-2">
					<NavItems items={navItems} />
					{session && <SearchCombobox />}
				</div>
				<div className="flex items-center gap-4">
					{!session && (
						<>
							<NavbarButton variant="secondary" to="/signin">
								Sign In
							</NavbarButton>
							<NavbarButton variant="primary" to="/signup">
								Get Started
							</NavbarButton>
						</>
					)}
					{session && (
						<ProfileDropdown
							session={{ ...session.session, user: session.user }}
						/>
					)}
				</div>
			</NavBody>
			<MobileNav>
				<MobileNavHeader>
					<NavbarLogo />
					<MobileNavToggle
						isOpen={isMobileMenuOpen}
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					/>
				</MobileNavHeader>

				<MobileNavMenu
					isOpen={isMobileMenuOpen}
					onClose={() => setIsMobileMenuOpen(false)}
				>
					{navItems.map((item, _idx) => (
						<Link
							to={item.link as "/"}
							key={`link-${item.name}`}
							onClick={() => setIsMobileMenuOpen(false)}
							className="relative text-foreground"
						>
							<span className="block">{item.name}</span>
						</Link>
					))}
					<Separator />
					<div className="flex w-full flex-col gap-4 pt-2">
						{!session && (
							<>
								<NavbarButton
									onClick={() => setIsMobileMenuOpen(false)}
									variant="primary"
									className="w-full"
									to={"/signin"}
								>
									Sign In
								</NavbarButton>
								<NavbarButton
									onClick={() => setIsMobileMenuOpen(false)}
									variant="primary"
									className="w-full"
									to={"/signup"}
								>
									Get Started
								</NavbarButton>
							</>
						)}
						{session && (
							<ProfileDropdown
								session={{ ...session.session, user: session.user }}
								onLinkClick={() => setIsMobileMenuOpen(false)}
							/>
						)}
					</div>
				</MobileNavMenu>
			</MobileNav>
		</Navbar>
	);
}

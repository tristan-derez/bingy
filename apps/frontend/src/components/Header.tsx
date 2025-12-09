import { Link, useRouteContext } from "@tanstack/react-router";

import { useState } from "react";
import { m } from "@/paraglide/messages";
import { LocaleRegionDropdown } from "./locale-region-dropdown";
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
			name: m.header_link_home(),
			link: "/",
			requiresAuth: false,
			hideWhenAuth: true,
		},
		{
			name: m.header_link_dashboard(),
			link: "/dashboard",
			requiresAuth: true,
			hideWhenAuth: false,
		},
		{
			name: m.header_link_movies(),
			link: "/movies" as const,
			requiresAuth: false,
			hideWhenAuth: false,
		},
		{
			name: m.header_link_tv_shows(),
			link: "/tv" as const,
			requiresAuth: false,
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
					<SearchCombobox />
				</div>
				<div className="flex items-center gap-4">
					<LocaleRegionDropdown />

					{!session && (
						<>
							<NavbarButton variant="secondary" to="/signin">
								{m.header_btn_sign_in()}
							</NavbarButton>
							<NavbarButton variant="primary" to="/signup">
								{m.header_btn_get_started()}
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

					<SearchCombobox title="Search for movies, tv shows or people" />

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
									{m.header_btn_sign_in()}
								</NavbarButton>
								<NavbarButton
									onClick={() => setIsMobileMenuOpen(false)}
									variant="primary"
									className="w-full"
									to={"/signup"}
								>
									{m.header_btn_get_started()}
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

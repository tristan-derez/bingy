import { useRouteContext } from "@tanstack/react-router";
import { User } from "lucide-react";
import { useState } from "react";
import { BiHomeAlt, BiMovie, BiSearch, BiTv } from "react-icons/bi";
import { m } from "@/paraglide/messages";
import { LocaleRegionDropdown } from "./locale-region-dropdown";
import { ProfileDropdown } from "./profile-dropdown";
import { SearchCombobox } from "./search/search-combobox";
import { MobileBottomNav, MobileTopBar } from "./ui/mobile-navbar";
import {
	MobileNavbarLogo,
	NavBody,
	Navbar,
	NavbarButton,
	NavbarLogo,
	NavItems,
} from "./ui/resizable-navbar";

export default function Header() {
	const { session } = useRouteContext({ from: "__root__" });
	const [searchOpen, setSearchOpen] = useState(false);

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
		{
			name: m.header_link_search(),
			icon: <BiSearch />,
			onClick: () => setSearchOpen(true),
		},
	] as const;

	const navItems = allNavItems.filter((item) => {
		if ("requiresAuth" in item && item.requiresAuth && !session) return false;
		if ("hideWhenAuth" in item && item.hideWhenAuth && session) return false;
		return true;
	});

	const mobileBottomItems = [
		{
			name: m.header_link_home(),
			link: session ? "/dashboard" : "/",
			icon: <BiHomeAlt />,
		},
		{
			name: m.header_link_movies(),
			link: "/movies",
			icon: <BiMovie />,
		},
		{
			name: m.header_link_tv_shows(),
			link: "/tv",
			icon: <BiTv />,
		},
		{
			name: m.header_link_search(),
			icon: <BiSearch />,
			onClick: () => setSearchOpen(true),
		},
		{
			name: m.header_link_profile(),
			link: "/profile",
			icon: <User />,
		},
	];

	return (
		<>
			{/* Desktop Navigation */}
			<Navbar>
				<NavBody>
					<NavbarLogo />
					<div className="flex items-center gap-2">
						<NavItems items={navItems} />
					</div>
					<div className="flex items-center gap-4">
						<LocaleRegionDropdown />

						{session ? (
							<ProfileDropdown session={session} />
						) : (
							<>
								<NavbarButton variant="secondary" to="/signin">
									{m.header_btn_sign_in()}
								</NavbarButton>
								<NavbarButton variant="primary" to="/signup">
									{m.header_btn_get_started()}
								</NavbarButton>
							</>
						)}
					</div>
				</NavBody>
			</Navbar>

			{/* Mobile Top Bar */}
			<MobileTopBar
				logo={<MobileNavbarLogo />}
				dropdown={
					<div className="flex items-center gap-3">
						<LocaleRegionDropdown />

						{session ? null : (
							<NavbarButton
								variant="primary"
								to="/signin"
								className="text-xs py-2.5 px-2"
							>
								{m.header_btn_sign_in()}
							</NavbarButton>
						)}
					</div>
				}
			/>

			{/* Mobile Bottom Navigation */}
			<MobileBottomNav items={mobileBottomItems} />
			<SearchCombobox
				open={searchOpen}
				setOpen={setSearchOpen}
				showButton={false}
			/>
		</>
	);
}

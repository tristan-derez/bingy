import {
	IconDeviceTv,
	IconMovie,
	IconSearch,
	IconSmartHome,
	IconUser,
} from "@tabler/icons-react";
import { useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { LocaleRegionDropdown } from "@/components/locale-region-dropdown";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { SearchCommand } from "@/components/search/search-command";
import { MobileBottomNav, MobileTopBar } from "@/components/ui/mobile-navbar";
import {
	MobileNavbarLogo,
	NavBody,
	Navbar,
	NavbarButton,
	NavbarLogo,
	NavItems,
} from "@/components/ui/resizable-navbar";
import { m } from "@/paraglide/messages";

export default function Header() {
	const { authData } = useRouteContext({ from: "__root__" });
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
			icon: <IconSearch className="h-4 w-4" />,
			onClick: () => setSearchOpen(true),
		},
	] as const;

	const navItems = allNavItems.filter((item) => {
		if ("requiresAuth" in item && item.requiresAuth && !authData) return false;
		if ("hideWhenAuth" in item && item.hideWhenAuth && authData) return false;
		return true;
	});

	const mobileBottomItems = [
		{
			name: m.header_link_home(),
			link: authData ? "/dashboard" : "/",
			icon: <IconSmartHome className="h-6 w-6" />,
		},
		{
			name: m.header_link_movies(),
			link: "/movies",
			icon: <IconMovie className="h-6 w-6" />,
		},
		{
			name: m.header_link_tv_shows(),
			link: "/tv",
			icon: <IconDeviceTv className="h-6 w-6" />,
		},
		{
			name: m.header_link_search(),
			icon: <IconSearch className="h-6 w-6" />,
			onClick: () => setSearchOpen(true),
		},
		{
			name: m.header_link_profile(),
			link: authData ? `/user/${authData?.user.name}` : `/signin`,
			icon: <IconUser className="h-6 w-6" />,
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

						{authData ? (
							<ProfileDropdown />
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

						{authData ? null : (
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
			<SearchCommand
				open={searchOpen}
				setOpen={setSearchOpen}
				showButton={false}
			/>
		</>
	);
}

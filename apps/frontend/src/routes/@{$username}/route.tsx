import {
	IconBrandInstagram,
	IconBrandX,
	IconLocation,
	IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useRef } from "react";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { ProfileBanner } from "@/components/profile-banner";
import { toast } from "@/components/toast/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfileInfo } from "@/hooks/useUserProfile";
import { m } from "@/paraglide/messages";
import { getTmdbImageUrl } from "@/utils/utils";

export const Route = createFileRoute("/@{$username}")({
	component: UserProfileLayout,
});

function UserProfileLayout() {
	const { username } = Route.useParams();
	const { data, error, isLoading } = useUserProfileInfo(username);
	const navRef = useRef<HTMLElement>(null);

	const handleMouseDown = (e: React.MouseEvent) => {
		const nav = navRef.current;
		if (!nav) return;

		const startX = e.pageX - nav.offsetLeft;
		const scrollLeft = nav.scrollLeft;

		const handleMouseMove = (e: MouseEvent) => {
			const x = e.pageX - nav.offsetLeft;
			const walk = (x - startX) * 2;
			nav.scrollLeft = scrollLeft - walk;
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	if (isLoading) return <LoadingCentered />;
	if (!data || error) return toast.error({ title: "well thats unfortunate" });

	const backgroundImage = getTmdbImageUrl("/gyrFASZMHZ3d4X2ZlrEZhRGr1zV.jpg");
	const profilePicture = data.avatarUrl;

	return (
		<div className="flex flex-col gap-4 w-full max-w-full min-w-full pt-8 lg:pt-30">
			<ProfileBanner backgroundImage={backgroundImage} />
			<div className="flex flex-col md:flex-row gap-2 lg:gap-4 self-center lg:self-start">
				<Avatar className="w-16 h-16 object-cover rounded-full cursor-pointer">
					<AvatarImage
						src={profilePicture ?? ""}
						alt={data.displayName ?? ""}
					/>
					<AvatarFallback className="rounded-full">
						{username ? username[0].toUpperCase() : "U"}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-2 justify-center">
					<div className="flex flex-col md:flex-row w-full">
						<div className="flex flex-row gap-2 items-center">
							<p className="font-extrabold text-sm md:text-base">
								{data.displayName}
							</p>
							<IconRosetteDiscountCheckFilled size={18} />
						</div>
					</div>
					<p className="text-muted-foreground max-w-120">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a lorem
						fermentum, mollis ante at, pharetra sapien. Integer fringilla
						iaculis lacus, eget molestie.
					</p>
					<div className="flex flex-row gap-2 items-center justify-between">
						<div className="flex flex-row gap-2 items-center text-sm">
							<IconLocation size={16} />
							<p>Paris</p>
						</div>
						<div className="flex flex-row gap-2 items-center">
							<IconBrandX size={18} />
							<IconBrandInstagram size={18} />
						</div>
					</div>
				</div>
			</div>
			<nav
				ref={navRef}
				onMouseDown={handleMouseDown}
				className="flex gap-6 border-b overflow-x-auto scrollbar-hide select-none"
			>
				<Link
					to="/@{$username}"
					params={{ username }}
					className="pb-3 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
					activeProps={{
						className: "pb-3 text-foreground border-b-2 border-brand",
					}}
					activeOptions={{ exact: true }}
				>
					{m.profile_page_title_text()}
				</Link>
				<Link
					to="/@{$username}/watchlist"
					params={{ username }}
					className="pb-3 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
					activeProps={{
						className: "pb-3 text-foreground border-b-2 border-brand",
					}}
				>
					{m.watchlist_page_title_text()}
				</Link>
				<Link
					to="/@{$username}/history"
					params={{ username }}
					className="pb-3 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
					activeProps={{
						className: "pb-3 text-foreground border-b-2 border-brand",
					}}
				>
					{m.history_page_title_text()}
				</Link>
				<Link
					to="/@{$username}/favorites"
					params={{ username }}
					className="pb-3 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
					activeProps={{
						className: "pb-3 text-foreground border-b-2 border-brand",
					}}
				>
					{m.favorites_page_title_text()}
				</Link>
				<Link
					to="/@{$username}/in-progress"
					params={{ username }}
					className="pb-3 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
					activeProps={{
						className: "pb-3 text-foreground border-b-2 border-brand",
					}}
				>
					{m.inprogress_title_text()}
				</Link>
				<Link
					to="/@{$username}/lists"
					params={{ username }}
					className="pb-3 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
					activeProps={{
						className: "pb-3 text-foreground border-b-2 border-brand",
					}}
				>
					{m.lists_page_title()}
				</Link>
			</nav>

			<Outlet />
		</div>
	);
}

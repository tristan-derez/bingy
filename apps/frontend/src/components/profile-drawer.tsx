import {
	IconAdjustmentsHorizontal,
	IconBrandGithub,
	IconClockBolt,
	IconExternalLink,
	IconHeart,
	IconHistory,
	IconLifebuoy,
	IconList,
	IconLogout,
	IconUser,
} from "@tabler/icons-react";
import {
	useNavigate,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { MobileProfileTriggerButton } from "@/components/mobile-profile-trigger";
import { toast } from "@/components/toast/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { queryClient } from "@/integrations/tanstack-query/root-provider";
import { authClient } from "@/lib/auth-client";
import { sessionQueryOptions } from "@/lib/queries/session";
import { m } from "@/paraglide/messages";

export function ProfileDrawer() {
	const { authData } = useRouteContext({ from: "__root__" });
	const navigate = useNavigate();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	if (!authData) return null;
	const username = authData.user.name;
	const displayName = authData.user.displayName;
	const image = authData.user.image;

	const logout = async () => {
		await authClient.signOut();

		queryClient.setQueryData(sessionQueryOptions.queryKey, null);
		queryClient.removeQueries({ queryKey: ["accounts"] });

		toast.success({ title: m.toast_success_logout() });

		await router.navigate({ to: "/" });
	};

	return (
		<Drawer swipeDirection="left" open={isOpen} onOpenChange={setIsOpen}>
			<DrawerTrigger
				render={(props) => <MobileProfileTriggerButton {...props} />}
			/>
			<DrawerContent className="focus:outline-none focus-visible:outline-none *:focus:outline-none">
				<DrawerHeader className="px-6">
					<Avatar
						className="w-16 h-16 object-cover rounded-full"
						onClick={() => {
							setIsOpen(false);
							navigate({
								to: "/@{$username}",
								params: { username },
							});
						}}
					>
						<AvatarImage src={image || ""} alt={displayName ?? username} />
						<AvatarFallback className="rounded-full">
							{username ? username.charAt(0) : "U"}
						</AvatarFallback>
					</Avatar>
					<DrawerTitle className="line-clamp-1 leading-relaxed">
						{displayName}
					</DrawerTitle>
					<DrawerDescription className="line-clamp-1 leading-relaxed">
						{authData.user.email}
					</DrawerDescription>
				</DrawerHeader>
				<DrawerBody>
					<Separator />
					<div className="flex flex-col items-center my-4 gap-4 px-3">
						<Button
							className="w-full justify-start"
							variant="ghost"
							onClick={() => {
								setIsOpen(false);
								navigate({
									to: "/@{$username}",
									params: { username },
								});
							}}
						>
							<IconUser />
							{m.dropdown_profile_text()}
						</Button>
						<Button
							className="w-full justify-start"
							variant="ghost"
							onClick={() => {
								setIsOpen(false);
								navigate({
									to: "/@{$username}/watchlist",
									params: { username },
								});
							}}
						>
							<IconClockBolt />
							{m.dropdown_watchlist_text()}
						</Button>
						<Button
							className="w-full justify-start"
							variant="ghost"
							onClick={() => {
								setIsOpen(false);
								navigate({
									to: "/@{$username}/lists",
									params: { username },
								});
							}}
						>
							<IconList />
							{m.dropdown_lists_text()}
						</Button>
						<Button
							className="w-full justify-start"
							variant="ghost"
							onClick={() => {
								setIsOpen(false);
								navigate({
									to: "/@{$username}/favorites",
									params: { username },
								});
							}}
						>
							<IconHeart />
							{m.dropdown_favorites_text()}
						</Button>
						<Button
							className="w-full justify-start"
							variant="ghost"
							onClick={() => {
								setIsOpen(false);
								navigate({
									to: "/@{$username}/history",
									params: { username },
								});
							}}
						>
							<IconHistory />
							{m.dropdown_history_text()}
						</Button>
						<Button
							className="w-full justify-start"
							variant="ghost"
							onClick={() => {
								setIsOpen(false);
								navigate({
									to: "/settings",
								});
							}}
						>
							<IconAdjustmentsHorizontal />
							{m.dropdown_settings_text()}
						</Button>
						<Button className="w-full" variant="ghost">
							<a
								href="https://github.com/tristan-derez/bingy"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-between w-full"
							>
								<div className="flex items-center gap-2">
									<IconBrandGithub className="w-4 h-4" />
									<span>GitHub</span>
								</div>
								<IconExternalLink className="w-4 h-4 text-muted-foreground" />
							</a>
						</Button>
						<Button disabled className="w-full justify-start" variant="ghost">
							<IconLifebuoy className="w-4 h-4" />
							<span>{m.dropdown_support_text()}</span>
						</Button>
					</div>
					<Separator />
				</DrawerBody>
				<DrawerFooter>
					<Button onClick={logout} variant="destructive" className="w-full">
						<IconLogout className="w-4 h-4" />
						<span>{m.dropdown_logout_text()}</span>
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

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
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/integrations/tanstack-query/root-provider";
import { authClient } from "@/lib/auth-client";
import { sessionQueryOptions } from "@/lib/queries/session";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ProfileDropdown = ({
	className,
	...props
}: ProfileDropdownProps) => {
	const { authData } = useRouteContext({ from: "__root__" });
	const navigate = useNavigate();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	if (!authData) return null;
	const username = authData.user.name;

	const logout = async () => {
		await authClient.signOut();

		queryClient.setQueryData(sessionQueryOptions.queryKey, null);
		queryClient.removeQueries({ queryKey: ["accounts"] });

		toast.success(m.toast_success_logout());

		await router.navigate({ to: "/" });
	};

	return (
		<div className={cn("relative", className)} {...props}>
			<DropdownMenu onOpenChange={setIsOpen} modal={false}>
				<div className="group relative">
					<DropdownMenuTrigger
						render={
							<button
								className={cn(
									"flex items-center h-10 gap-2 p-3 rounded-md border transition-all duration-200 focus:outline-none",
									"bg-transparent border-border hover:bg-card-foreground/10 hover:border-ring",
								)}
							>
								<div className="text-left flex-1">
									<div className="text-sm font-medium tracking-tight leading-tight text-foreground">
										{authData.user.displayName}
									</div>
								</div>
								<div className="relative">
									<div className="w-8 h-8 rounded-full p-0.5">
										<div className="w-full h-full rounded-full overflow-hidden bg-card">
											<Avatar className="w-full h-full object-cover rounded-full">
												<AvatarImage
													src={authData.user?.image || ""}
													alt={username}
												/>
												<AvatarFallback className="rounded-lg">
													{username ? username[0].toUpperCase() : "U"}
												</AvatarFallback>
											</Avatar>
										</div>
									</div>
								</div>
							</button>
						}
					/>

					<div
						className={cn(
							"absolute -right-3 top-1/2 -translate-y-1/2 transition-all duration-200",
							isOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100",
						)}
					>
						<svg
							width="12"
							height="24"
							viewBox="0 0 12 24"
							fill="none"
							className={cn(
								"transition-all duration-200",
								isOpen
									? "text-orange-500 dark:text-orange-400 scale-150"
									: "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
							)}
							aria-hidden="true"
						>
							<path
								d="M2 4C6 8 6 16 2 20"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								fill="none"
							/>
						</svg>
					</div>

					<DropdownMenuContent
						align="end"
						sideOffset={4}
						className={cn(
							"z-99 w-45 p-2 rounded-2xl shadow-xl shadow-ring/10",
							"bg-card/70 backdrop-blur-sm",
							"data-[state=open]:animate-in data-[state=closed]:animate-out",
							"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
							"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
							"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
							"data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
							"origin-top-right",
							className,
						)}
					>
						<DropdownMenuItem
							onClick={() =>
								navigate({
									to: "/user/$username",
									params: { username },
								})
							}
						>
							<IconUser />
							{m.dropdown_profile_text()}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate({
									to: "/user/$username/watchlist",
									params: { username },
								})
							}
						>
							<IconClockBolt />
							{m.dropdown_watchlist_text()}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate({
									to: "/user/$username/lists",
									params: { username },
								})
							}
						>
							<IconList />
							{m.dropdown_lists_text()}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate({
									to: "/user/$username/favorites",
									params: { username },
								})
							}
						>
							<IconHeart />
							{m.dropdown_favorites_text()}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate({
									to: "/user/$username/history",
									params: { username },
								})
							}
						>
							<IconHistory />
							{m.dropdown_history_text()}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate({
									to: "/settings",
								})
							}
						>
							<IconAdjustmentsHorizontal />
							{m.dropdown_settings_text()}
						</DropdownMenuItem>
						<DropdownMenuSeparator className="bg-border" />
						<DropdownMenuItem>
							<a
								href="https://github.com/tristan-derez/bingy"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-2">
									<IconBrandGithub className="w-4 h-4" />
									<span>GitHub</span>
								</div>
							</a>
							<DropdownMenuShortcut>
								<IconExternalLink className="text-muted-foreground" />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem disabled>
							<IconLifebuoy className="w-4 h-4" />
							<span>{m.dropdown_support_text()}</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator className="bg-border" />
						<DropdownMenuItem onClick={logout} variant="destructive">
							<IconLogout className="w-4 h-4" />
							<span>{m.dropdown_logout_text()}</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</div>
			</DropdownMenu>
		</div>
	);
};

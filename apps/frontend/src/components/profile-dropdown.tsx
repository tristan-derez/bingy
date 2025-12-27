import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { IoLogOutSharp, IoSettingsSharp } from "react-icons/io5";
import { MdSupport, MdWatchLater } from "react-icons/md";
import { PiUserFill } from "react-icons/pi";
import { toast } from "sonner";
import { queryClient } from "@/integrations/tanstack-query/root-provider";
import { authClient } from "@/lib/auth-client";
import { sessionQueryOptions } from "@/lib/queries/session";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type SessionData = ReturnType<typeof authClient.useSession>["data"];

export type Session = NonNullable<SessionData>;

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
	session: Session;
	onLinkClick?: () => void;
}

export const ProfileDropdown = ({
	session,
	className,
	onLinkClick,
	...props
}: ProfileDropdownProps) => {
	const router = useRouter();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	const logout = async () => {
		onLinkClick?.();

		await authClient.signOut();

		queryClient.setQueryData(sessionQueryOptions.queryKey, null);

		toast.success(m.toast_success_logout());

		await router.invalidate();
		await navigate({ to: "/" });
	};

	return (
		<div className={cn("relative", className)} {...props}>
			<DropdownMenu onOpenChange={setIsOpen} modal={false}>
				<div className="group relative">
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className={cn(
								"flex items-center h-10 gap-2 p-3 rounded-md border transition-all duration-200 focus:outline-none",
								"bg-transparent border-border hover:bg-card-foreground/10 hover:border-ring",
							)}
						>
							<div className="text-left flex-1">
								<div className="text-sm font-medium tracking-tight leading-tight text-foreground">
									{session.user.displayName}
								</div>
							</div>
							<div className="relative">
								<div className="w-8 h-8 rounded-full p-0.5">
									<div className="w-full h-full rounded-full overflow-hidden bg-card">
										<Avatar className="w-full h-full object-cover rounded-full">
											<AvatarImage
												src={session.user?.image || ""}
												alt={session.user.name}
											/>
											<AvatarFallback className="rounded-lg">
												{session.user.name
													? session.user.name[0].toUpperCase()
													: "U"}
											</AvatarFallback>
										</Avatar>
									</div>
								</div>
							</div>
						</button>
					</DropdownMenuTrigger>

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
							"z-99 w-[300px] md:w-[250px] p-2 rounded-2xl shadow-xl shadow-ring/10",
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
						<DropdownMenuItem asChild>
							<Link
								to="/user/$username"
								params={{ username: session.user.name }}
								onClick={onLinkClick}
							>
								<PiUserFill />
								{m.dropdown_profile_text()}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								to="/user/$username/watchlist"
								params={{ username: session.user.name }}
								onClick={onLinkClick}
							>
								<MdWatchLater />
								{m.dropdown_watchlist_text()}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/settings" onClick={onLinkClick}>
								<IoSettingsSharp />
								{m.dropdown_settings_text()}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator className="bg-border" />
						<DropdownMenuItem asChild>
							<a
								href="https://github.com/tristan-derez/bingy"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-2">
									<FaGithub />
									<span>GitHub</span>
								</div>
								<ExternalLink className="text-muted-foreground" />
							</a>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<MdSupport />
							<span>{m.dropdown_support_text()}</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator className="bg-border" />
						<DropdownMenuItem onSelect={logout}>
							<IoLogOutSharp />
							<span>{m.dropdown_logout_text()}</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</div>
			</DropdownMenu>
		</div>
	);
};

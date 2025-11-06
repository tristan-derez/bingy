import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import type { Session as BaseSession, User } from "better-auth";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { IoLogOutSharp, IoSettingsSharp } from "react-icons/io5";
import { MdSupport } from "react-icons/md";
import { PiUserFill } from "react-icons/pi";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type Session = BaseSession & {
	user: User;
};

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
	session: Session;
}

export const ProfileDropdown = ({
	session,
	className,
	...props
}: ProfileDropdownProps) => {
	const router = useRouter();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	const logout = async () => {
		toast.success("You have been successfully logged out. Come back soon!");
		await authClient.signOut();
		router.invalidate().finally(() => {
			navigate({ to: "/" });
		});
	};

	return (
		<div className={cn("relative", className)} {...props}>
			<DropdownMenu onOpenChange={setIsOpen} modal={false}>
				<div className="group relative">
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className={cn(
								"flex items-center w-full gap-16 p-3 rounded-2xl border transition-all duration-200 focus:outline-none",
								"bg-[color:var(--card)] border-[color:var(--border)] hover:bg-[color:var(--card-foreground)/10] hover:border-[color:var(--ring)]",
							)}
						>
							<div className="text-left flex-1">
								<div className="text-sm font-medium tracking-tight leading-tight text-[color:var(--foreground)]">
									{session.user.name}
								</div>
								<div className="text-xs tracking-tight leading-tight text-[color:var(--muted-foreground)]">
									{session.user.email}
								</div>
							</div>
							<div className="relative">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
									<div className="w-full h-full rounded-full overflow-hidden bg-[color:var(--card)]">
										<Avatar className="w-full h-full object-cover rounded-full">
											<AvatarImage
												src={session.user?.image || ""}
												alt={session.user.name}
											/>
											<AvatarFallback className="rounded-lg">
												{session.user.name ? session.user.name[0] : "U"}
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
							"z-99 w-[300px] md:w-[250px] p-2 rounded-2xl shadow-xl shadow-[color:var(--ring)/10]",
							"bg-[color:var(--card)/70] backdrop-blur-sm",
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
								to="/profile"
								className="flex items-center gap-2 text-[color:var(--foreground)]"
							>
								<PiUserFill />
								Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								to="/settings"
								className="flex items-center gap-2 text-[color:var(--foreground)]"
							>
								<IoSettingsSharp />
								Settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator className="border-[color:var(--border)]" />
						<DropdownMenuItem>
							<FaGithub className="mr-2 text-[color:var(--foreground)]" />
							<a
								href="https://github.com/tristan-derez/bingy"
								className="text-[color:var(--foreground)]"
							>
								GitHub
							</a>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<MdSupport className="mr-2 text-[color:var(--foreground)]" />
							<span className="text-[color:var(--foreground)]">Support</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator className="border-[color:var(--border)]" />
						<DropdownMenuItem onSelect={logout}>
							<IoLogOutSharp className="mr-2 text-[color:var(--foreground)]" />
							<span className="text-[color:var(--foreground)]">Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</div>
			</DropdownMenu>
		</div>
	);
};

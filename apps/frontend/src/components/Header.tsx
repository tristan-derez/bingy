import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronsUpDown } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { IoLogOutSharp } from "react-icons/io5";
import { MdSupport } from "react-icons/md";
import { PiUserFill } from "react-icons/pi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { toast } from "sonner";
import { SettingsDialog } from "@/components/settings-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export default function Header() {
	const router = useRouter();
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();

	const logout = async () => {
		toast.success("You have been successfully logged out. Come back soon!");
		await authClient.signOut();
		router.invalidate().finally(() => {
			navigate({ to: "/" });
		});
	};

	return (
		<div className="p-4 flex justify-between w-full fixed items-center backdrop-blur-sm border-b border-border/40 shadow-md bg-transparent">
			<nav>
				<ul className="flex gap-4">
					<li>
						<Link to="/" className="[&.active]:font-bold">
							Home
						</Link>
					</li>
					{session && (
						<li>
							<Link to="/dashboard" className="[&.active]:font-bold">
								Dashboard
							</Link>
						</li>
					)}
				</ul>
			</nav>
			<nav>
				<ul className="flex gap-2 items-center">
					{!session && (
						<>
							<Button
								variant="ghost"
								onClick={() => navigate({ to: "/signin" })}
							>
								Sign In
							</Button>
							<Button onClick={() => navigate({ to: "/signup" })}>
								Get Started
							</Button>
						</>
					)}
					{session && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size="lg"
									variant="ghost"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={session.user?.image || ""}
											alt={session.user.name}
										/>
										<AvatarFallback className="rounded-lg">
											{session.user?.name ? session.user.name[0] : "U"}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{session.user?.name}
										</span>
										<span className="truncate text-xs">
											{session.user?.email}
										</span>
									</div>
									<ChevronsUpDown className="ml-auto size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56 rounded-lg"
								align="end"
								sideOffset={4}
							>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage
												src={session.user?.image || ""}
												alt={session.user.name}
											/>
											<AvatarFallback className="rounded-lg">
												{session.user?.name ? session.user.name[0] : "U"}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium">
												{session.user?.name}
											</span>
											<span className="truncate text-xs">
												{session.user?.email}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link to="/profile">
											<PiUserFill />
											Profile
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/settings">
											<RiVerifiedBadgeFill />
											Account
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										<SettingsDialog />
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<FaGithub />
									<a href="https://github.com/tristan-derez/bingy">GitHub</a>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<MdSupport />
									Support
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onSelect={logout}>
									<IoLogOutSharp />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</ul>
			</nav>
		</div>
	);
}

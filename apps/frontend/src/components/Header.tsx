import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { FaGithub, FaUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineSupport } from "react-icons/md";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/session";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

export default function Header() {
	const navigate = useNavigate();
	const { data: session } = useSession();
	const logout = async () => {
		if (session) {
			await authClient.revokeSession({
				token: session.session.token,
			});
			navigate({ to: "/" });
		}
	};
	return (
		<div className="p-4 flex justify-between w-full fixed items-center backdrop-blur-md border-b border-border/40 shadow-sm bg-transparent">
			<nav>
				<ul className="flex gap-4">
					<li>
						<Link to="/" className="[&.active]:font-bold">
							Home
						</Link>
					</li>
					{session && (
						<li>
							<Link to="/" className="[&.active]:font-bold">
								Dashboard
							</Link>
						</li>
					)}
				</ul>
			</nav>
			<nav>
				<ul className="flex gap-2 items-center">
					{!session && (
						<li>
							<Link
								to="/signin"
								className={
									location.pathname === "/signin" ? "[&.active]:font-bold" : ""
								}
							>
								Sign In
							</Link>
						</li>
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
										<Link to="/">
											<FaUser />
											Profile
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										<Dialog>
											<DialogTrigger asChild>
												<div className="flex items-center w-full">
													<IoMdSettings className="mr-2" />
													<span>Settings</span>
												</div>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Change Theme</DialogTitle>
													<DialogDescription>
														Select your preferred theme
													</DialogDescription>
												</DialogHeader>
												<div className="flex py-4">
													<ModeToggle />
												</div>
											</DialogContent>
										</Dialog>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<FaGithub />
									GitHub
								</DropdownMenuItem>
								<DropdownMenuItem>
									<MdOutlineSupport />
									Support
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onSelect={logout}>
									<LogOut />
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

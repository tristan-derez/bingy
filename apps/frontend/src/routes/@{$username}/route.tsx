import {
	createFileRoute,
	Outlet,
	useNavigate,
	useRouteContext,
} from "@tanstack/react-router";
import { useState } from "react";
import { EditProfileDialog } from "@/components/auth/edit-profile-dialog";
import { CenteredLayout } from "@/components/layout/centered-layout";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { ProfileBanner } from "@/components/profile-banner";
import { ProfileInfos } from "@/components/profile-infos";
import { ProfileNav } from "@/components/profile-nav";
import { toast } from "@/components/toast/toast";
import { useUserProfileInfo } from "@/hooks/useUserProfile";
import { m } from "@/paraglide/messages";
import { getTmdbImageUrl, isOwnProfile } from "@/utils/utils";

export const Route = createFileRoute("/@{$username}")({
	component: UserProfileLayout,
});

function UserProfileLayout() {
	const { username } = Route.useParams();
	const { authData } = useRouteContext({ from: "__root__" });
	const showEditButton = authData
		? isOwnProfile(authData.user.name, username)
		: false;
	const navigate = useNavigate();

	const { data, error, isLoading } = useUserProfileInfo(username);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	const onEditClick = () => {
		setIsEditDialogOpen(true);
	};

	if (isLoading) return <LoadingCentered />;
	if (!data) {
		// @todo: add user 404
		return (
			<CenteredLayout>
				<p>User not found :(</p>
			</CenteredLayout>
		);
	}
	if (error) {
		navigate({ to: ".." });
		return toast.error({ title: m.toast_error_profile_route_generic() });
	}

	const backgroundImage = getTmdbImageUrl("/gyrFASZMHZ3d4X2ZlrEZhRGr1zV.jpg");

	return (
		<div className="flex flex-col w-full max-w-full min-w-full pt-8 lg:pt-30">
			<div className="max-w-4xl mx-auto w-full gap-4 flex flex-col">
				<ProfileBanner backgroundImage={backgroundImage} />
				<ProfileInfos
					displayName={data.displayName}
					avatar={data.avatarUrl}
					bio={data.bio}
					location={data.location}
					showEditButton={showEditButton}
					onEditClick={onEditClick}
				/>
				<ProfileNav username={username} />

				<Outlet />
				<EditProfileDialog
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					bio={data.bio}
					location={data.location}
				/>
			</div>
		</div>
	);
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	fetchUserActivity,
	fetchUserFavorites,
	fetchUserLists,
	fetchUserProfileInfo,
	fetchUserWatchlist,
	type UpdateAvatarPayload,
	updateAvatar,
} from "@/api/user-profile";
import { toast } from "@/components/toast/toast";
import { m } from "@/paraglide/messages";

export function useUserProfileInfo(username: string) {
	return useQuery({
		queryKey: ["user-profile", username],
		queryFn: () => fetchUserProfileInfo(username),
		staleTime: 1000 * 60 * 10,
		enabled: !!username,
	});
}

export function useUserActivity(username: string, language = "en-US") {
	return useQuery({
		queryKey: ["user-profile", "activity", username, language],
		queryFn: () => fetchUserActivity(username, language),
		staleTime: 1000 * 60 * 5,
		enabled: !!username,
	});
}

export function useUserFavorites(username: string, language = "en-US") {
	return useQuery({
		queryKey: ["user-profile", "favorites", username, language],
		queryFn: () => fetchUserFavorites(username, language),
		staleTime: 1000 * 60 * 10,
		enabled: !!username,
	});
}

export function useUserWatchlist(username: string, language = "en-US") {
	return useQuery({
		queryKey: ["user-profile", "watchlist", username, language],
		queryFn: () => fetchUserWatchlist(username, language),
		staleTime: 1000 * 60 * 10,
		enabled: !!username,
	});
}

export function useUserLists(username: string, language = "en-US") {
	return useQuery({
		queryKey: ["user-profile", "lists", username, language],
		queryFn: () => fetchUserLists(username, language),
		staleTime: 1000 * 60 * 10,
		enabled: !!username,
	});
}

export function useUpdateAvatar() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: UpdateAvatarPayload) => {
			return updateAvatar(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user-profile"],
				exact: false,
			});
			toast.success({ title: m.toast_update_avatar_success() });
		},
		onError: () => {
			toast.error({ title: m.toast_update_avatar_error() });
		},
	});
}

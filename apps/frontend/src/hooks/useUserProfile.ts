import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	deleteAvatar,
	fetchUserActivity,
	fetchUserFavorites,
	fetchUserLists,
	fetchUserProfileInfo,
	fetchUserWatchlist,
	type UpdateUserProfilePayload,
	updateAvatar,
	updateUserProfile,
} from "@/api/user-profile";
import { toast } from "@/components/toast/toast";
import { authClient } from "@/lib/auth-client";
import { sessionQueryOptions } from "@/lib/queries/session";
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
		queryKey: ["user-profile", username, "activity", language],
		queryFn: () => fetchUserActivity(username, language),
		staleTime: 1000 * 60 * 5,
		enabled: !!username,
	});
}

export function useUserFavorites(username: string, language = "en-US") {
	return useQuery({
		queryKey: ["user-profile", username, "favorites", language],
		queryFn: () => fetchUserFavorites(username, language),
		staleTime: 1000 * 60 * 10,
		enabled: !!username,
	});
}

export function useUserWatchlist(username: string, language = "en-US") {
	return useQuery({
		queryKey: ["user-profile", username, "watchlist", language],
		queryFn: () => fetchUserWatchlist(username, language),
		staleTime: 1000 * 60 * 10,
		enabled: !!username,
	});
}

export function useUserLists(username: string, language = "en-US") {
	return useQuery({
		queryKey: ["user-profile", username, "lists", language],
		queryFn: () => fetchUserLists(username, language),
		staleTime: 1000 * 60 * 10,
		enabled: !!username,
	});
}

export function useUpdateAvatar() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file: File) => {
			return updateAvatar(file);
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ["user-profile"],
				exact: false,
			});

			const { data: freshSession } = await authClient.getSession({
				query: { disableCookieCache: true },
			});
			queryClient.setQueryData(sessionQueryOptions.queryKey, freshSession);

			toast.success({ title: m.toast_update_avatar_success() });
		},
		onError: () => {
			toast.error({ title: m.toast_update_avatar_error() });
		},
	});
}

export function useDeleteAvatar() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			return deleteAvatar();
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ["user-profile"],
				exact: false,
			});

			const { data: freshSession } = await authClient.getSession({
				query: { disableCookieCache: true },
			});
			queryClient.setQueryData(sessionQueryOptions.queryKey, freshSession);

			toast.success({ title: m.toast_delete_avatar_success() });
		},
		onError: () => {
			toast.error({ title: m.toast_delete_avatar_error() });
		},
	});
}

export function useUpdateUserProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: UpdateUserProfilePayload) => {
			return updateUserProfile(payload);
		},
		onSuccess: (_data) => {
			queryClient.invalidateQueries({
				queryKey: ["user-profile"],
				exact: false,
			});
			queryClient.invalidateQueries({
				queryKey: ["session"],
			});

			toast.success({ title: m.toast_update_profile_success() });
		},
		onError: () => {
			toast.error({ title: m.toast_update_profile_error() });
		},
	});
}

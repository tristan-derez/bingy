import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	type AddToFavoritesPayload,
	addToFavorites,
	getFavorite,
	getFavorites,
	removeFromFavorites,
} from "@/api/favorites";
import { m } from "@/paraglide/messages";

export function useFavorites(
	username: string,
	page = 1,
	language: string,
	mediaType?: "movie" | "tv",
) {
	return useQuery({
		queryKey: ["favorites", username, page, language, mediaType],
		queryFn: () => getFavorites(username, page, language, mediaType),
		staleTime: 1000 * 60 * 10,
	});
}

export function useFavorite(tmdbId: number, mediaType: "movie" | "tv") {
	return useQuery({
		queryKey: ["favorites", tmdbId, mediaType],
		queryFn: () => getFavorite(tmdbId, mediaType),
		staleTime: 1000 * 60 * 10,
		enabled: !!tmdbId,
	});
}

export function useAddToFavorites() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: AddToFavoritesPayload & { mediaName: string }) =>
			addToFavorites(payload),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["favorites"],
			});
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});

			toast.success(
				m.toast_add_to_favorites_success({ name: variables.mediaName }),
			);
		},
		onError: (_error, variables) => {
			toast.error(
				m.toast_add_to_favorites_error({ name: variables.mediaName }),
			);
		},
	});
}

export function useRemoveFromFavorites() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			tmdbId,
			mediaType,
		}: {
			tmdbId: number;
			mediaType: "movie" | "tv";
			mediaName: string;
		}) => removeFromFavorites(tmdbId, mediaType),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["favorites"],
			});

			toast.success(
				m.toast_remove_from_favorites_success({
					name: variables.mediaName,
				}),
			);
		},
		onError: (_error, variables) => {
			toast.error(
				m.toast_remove_from_favorites_error({ name: variables.mediaName }),
			);
		},
	});
}

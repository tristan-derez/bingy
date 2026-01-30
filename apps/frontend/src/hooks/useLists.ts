import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import {
	type AddMediaToListPayload,
	type AddMediaToWatchlistPayload,
	type CreateListPayload,
	deleteList,
	deleteMediaList,
	deleteMediaWatchlist,
	fetchCheckItemInWatchlist,
	fetchListBySlug,
	fetchLists,
	fetchWatchlist,
	postList,
	postMediaList,
	postMediaWatchlist,
	type RemoveMediaFromListPayload,
	type RemoveMediaFromWatchlistPayload,
} from "@/api/lists";
import { m } from "@/paraglide/messages";

export function useWatchlist(
	username: string,
	page = 1,
	language: string,
	mediaType?: "movie" | "tv",
) {
	return useQuery({
		queryKey: ["lists", "watchlist", username, page, language, mediaType],
		queryFn: () => fetchWatchlist(username, page, language, mediaType),
		staleTime: 1000 * 60 * 10,
	});
}

export function useIsInWatchlist(tmdbMediaType: string, tmdbId: number) {
	return useQuery({
		queryKey: ["lists", "watchlist", "check", tmdbMediaType, tmdbId],
		queryFn: () => fetchCheckItemInWatchlist(tmdbMediaType, tmdbId),
		staleTime: 1000 * 60 * 10,
	});
}

export function useAddMediaToWatchlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: AddMediaToWatchlistPayload) => {
			return postMediaWatchlist(payload);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			const title = variables.title || variables.name;
			toast.success(m.toast_watchlist_media_success({ media: `"${title}"` }));
		},
		onError: (_, variables) => {
			const title = variables.title || variables.name;
			toast.error(m.toast_watchlist_media_error({ media: `"${title}"` }));
		},
	});
}

export function useRemoveFromWatchlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: RemoveMediaFromWatchlistPayload) => {
			return deleteMediaWatchlist(payload);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			const title = variables.title || variables.name;
			toast.success(m.toast_remove_watchlist_success({ media: `"${title}"` }));
		},
		onError: (_, variables) => {
			const title = variables.title || variables.name;
			toast.error(m.toast_remove_watchlist_error({ media: `"${title}"` }));
		},
	});
}

export function useLists(username: string, page = 1, filter = "all") {
	return useQuery({
		queryKey: ["lists", "custom-list", username, page, filter],
		queryFn: () => fetchLists(username, page, filter),
		staleTime: 1000 * 60 * 50,
	});
}

export function useListBySlug(username: string, slug: string, page = 1) {
	return useQuery({
		queryKey: ["lists", "custom-list", username, slug, page],
		queryFn: () => fetchListBySlug(username, slug, page),
		staleTime: 1000 * 60 * 10,
	});
}

export function useCreateList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: CreateListPayload) => {
			return postList(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["lists"],
			});
		},
	});
}

export function useDeleteList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (listId: string) => {
			return deleteList(listId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["lists"],
			});
			toast.success(m.toast_delete_list_success());
		},
		onError: () => {
			toast.error(m.toast_delete_list_error());
		},
	});
}

export function useAddMediaToList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: AddMediaToListPayload) => {
			return postMediaList(payload);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["lists", "list", variables.name],
			});
			const title = variables.title || variables.name;
			toast.success(
				m.toast_add_to_list_media_success({
					media: `"${title}"`,
					list: variables.listName,
				}),
				{
					action: {
						label: "See list",
						onClick: () => redirect({ to: "/" }),
					},
				},
			);
		},
		onError: (_, variables) => {
			const title = variables.title || variables.name;
			toast.error(
				m.toast_add_to_list_media_error({
					media: `"${title}"`,
					list: variables.listName,
				}),
			);
		},
	});
}

export function useRemoveFromList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: RemoveMediaFromListPayload) => {
			return deleteMediaList(payload);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["lists", "list", variables.listName],
			});
			const title = variables.title || variables.name;
			toast.success(
				m.toast_remove_from_list_media_success({
					media: `"${title}"`,
					list: variables.listName,
				}),
			);
		},
		onError: (_, variables) => {
			const title = variables.title || variables.name;
			toast.error(
				m.toast_remove_from_list_media_error({
					media: `"${title}"`,
					list: variables.listName,
				}),
			);
		},
	});
}

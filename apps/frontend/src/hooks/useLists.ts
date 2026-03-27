import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { Pretty } from "shared";
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
	patchList,
	postList,
	postMediaList,
	postMediaWatchlist,
	type RemoveMediaFromListPayload,
	type RemoveMediaFromWatchlistPayload,
	type UpdateListPayload,
} from "@/api/lists";
import { toast } from "@/components/toast/toast";
import { m } from "@/paraglide/messages";

export type AddMediaToListMutationVariables = Pretty<
	AddMediaToListPayload & {
		username: string;
		listName: string;
		listSlug: string;
		listId: string;
		title?: string;
		name?: string;
	}
>;

export type RemoveMediaFromListMutationVariables = Pretty<
	RemoveMediaFromListPayload & {
		listSlug: string;
		title?: string;
		name?: string;
		listName: string;
	}
>;

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

export function useAddMediaToWatchlist(username: string) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (payload: AddMediaToWatchlistPayload) => {
			return postMediaWatchlist(payload);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			const title = variables.title || variables.name;
			toast.success({
				title: m.toast_watchlist_media_success({ media: `"${title}"` }),
				button: {
					label: m.btn_go_to_watchlist(),
					onClick: () => {
						navigate({
							to: "/user/$username/watchlist",
							params: { username },
						});
					},
				},
			});
		},
		onError: (_, variables) => {
			const title = variables.title || variables.name;
			toast.error({
				title: m.toast_watchlist_media_error({ media: `"${title}"` }),
			});
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
			toast.success({
				title: m.toast_remove_watchlist_success({ media: `"${title}"` }),
			});
		},
		onError: (_, variables) => {
			const title = variables.title || variables.name;
			toast.error({
				title: m.toast_remove_watchlist_error({ media: `"${title}"` }),
			});
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

export function useInfiniteLists(username: string, filter = "all") {
	return useInfiniteQuery({
		queryKey: ["lists", "custom-list", username, filter],
		queryFn: ({ pageParam }) => fetchLists(username, pageParam, filter),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			return lastPage.page < lastPage.total_pages
				? lastPage.page + 1
				: undefined;
		},
		staleTime: 1000 * 60 * 50,
	});
}

export function useListBySlug(
	username: string,
	slug: string,
	language = "en-US",
	page = 1,
) {
	return useQuery({
		queryKey: ["lists", "custom-list", username, slug, page],
		queryFn: () => fetchListBySlug(username, slug, language, page),
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
				queryKey: ["lists", "custom-list"],
				exact: false,
			});
		},
	});
}

export function useUpdateList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			listId,
			payload,
		}: {
			listId: string;
			payload: UpdateListPayload;
		}) => {
			return patchList(listId, payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["lists", "custom-list"],
				exact: false,
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
				queryKey: ["lists", "custom-list"],
				exact: false,
			});
			toast.success({ title: m.toast_delete_list_success() });
		},
		onError: () => {
			toast.error({ title: m.toast_delete_list_error() });
		},
	});
}

export function useAddMediaToList() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (variables: AddMediaToListMutationVariables) => {
			const { listName, title, name, ...payload } = variables;
			return postMediaList(payload);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [
					"lists",
					"custom-list",
					variables.username,
					variables.listSlug,
				],
			});
			const mediaTitle = variables.title || variables.name;
			toast.success({
				title: m.toast_add_to_list_media_success({
					media: `"${mediaTitle}"`,
					list: variables.listName,
				}),
				button: {
					label: m.item_added_to_list_success_cta(),
					onClick: () => {
						navigate({
							to: "/user/$username/lists/$slug",
							params: {
								username: variables.username,
								slug: variables.listSlug,
							},
						});
					},
				},
			});
		},
		onError: (_, variables) => {
			const mediaTitle = variables.title || variables.name;
			toast.error({
				title: m.toast_add_to_list_media_error({
					media: `"${mediaTitle}"`,
					list: variables.listName,
				}),
			});
		},
	});
}
export function useRemoveFromList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (variables: RemoveMediaFromListMutationVariables) => {
			const { listName, title, name, ...payload } = variables;
			return deleteMediaList(payload);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["lists", "custom-list", variables.listSlug],
			});
			const title = variables.title || variables.name;
			toast.success({
				title: m.toast_remove_from_list_media_success({
					media: `"${title}"`,
					list: variables.listName,
				}),
			});
		},
		onError: (_, variables) => {
			const title = variables.title || variables.name;
			toast.error({
				title: m.toast_remove_from_list_media_error({
					media: `"${title}"`,
					list: variables.listName,
				}),
			});
		},
	});
}

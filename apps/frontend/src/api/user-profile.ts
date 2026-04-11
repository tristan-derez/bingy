import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

type MediaDetails = Pretty<{
	id: number;
	title?: string;
	name?: string;
	originalTitle?: string;
	originalName?: string;
	releaseDate?: string;
	firstAirDate?: string;
	posterPath: string | null;
	backdropPath: string | null;
	voteAverage: number;
	overview: string;
	mediaType: "movie" | "tv";
	addedAt?: Date;
	position?: number;
	note?: string | null;
}>;

export type UserProfileInfoResponse = Pretty<{
	name: string;
	displayName: string;
	avatarUrl: string | null;
	bio?: string | null;
	location?: string | null;
}>;

export type UserActivityResponse = Pretty<{
	data: Array<{
		id: string;
		userId: string;
		activityType: string;
		createdAt: Date;
		mediaDetails: MediaDetails | null;
		movieWatchHistory?: {
			media: {
				tmdbId: number;
				mediaType: "movie" | "tv";
			};
		} | null;
		tvShowWatchHistory?: {
			media: {
				tmdbId: number;
				mediaType: "movie" | "tv";
			};
		} | null;
		tvShowProgress?: {
			media: {
				tmdbId: number;
				mediaType: "movie" | "tv";
			};
		} | null;
		watchlist?: {
			media: {
				tmdbId: number;
				mediaType: "movie" | "tv";
			};
		} | null;
		reviewComment?: unknown;
		customList?: unknown;
	}>;
}>;

export type UserFavoritesResponse = Pretty<{
	data: MediaDetails[];
}>;

export type UserWatchlistResponse = Pretty<{
	data: MediaDetails[];
}>;

export type UserListsResponse = Pretty<{
	data: Array<{
		id: string;
		userId: string;
		name: string;
		slug: string;
		description: string | null;
		type: "unranked" | "ranked";
		visibility: "limited" | "private" | "public";
		createdAt: Date;
		updatedAt: Date | null;
		deletedAt: Date | null;
		items: MediaDetails[];
	}>;
}>;

export type UpdateAvatarResponse = Pretty<{
	avatarUrl: string | null;
}>;

export type UpdateUserProfilePayload = Pretty<{
	bio?: string;
	location?: string;
}>;

export type UpdateUserProfileResponse = Pretty<{
	user: {
		bio: string | null;
		location: string | null;
	};
}>;

export const fetchUserProfileInfo = async (username: string) => {
	const res = await apiFetch<UserProfileInfoResponse>(`/user/${username}`, {
		method: "GET",
	});
	return res;
};

export const fetchUserActivity = async (
	username: string,
	language = "en-US",
) => {
	const res = await apiFetch<UserActivityResponse>(
		`/user/${username}/activity`,
		{
			method: "GET",
			query: { language },
		},
	);
	return res;
};

export const fetchUserFavorites = async (
	username: string,
	language = "en-US",
) => {
	const res = await apiFetch<UserFavoritesResponse>(
		`/user/${username}/favorites`,
		{
			method: "GET",
			query: { language },
		},
	);
	return res;
};

export const fetchUserWatchlist = async (
	username: string,
	language = "en-US",
) => {
	const res = await apiFetch<UserWatchlistResponse>(
		`/user/${username}/watchlist`,
		{
			method: "GET",
			query: { language },
		},
	);
	return res;
};

export const fetchUserLists = async (username: string, language = "en-US") => {
	const res = await apiFetch<UserListsResponse>(`/user/${username}/lists`, {
		method: "GET",
		query: { language },
	});
	return res;
};

export const updateUserProfile = async (payload: UpdateUserProfilePayload) => {
	const res = await apiFetch<UpdateUserProfileResponse>("/user", {
		method: "PATCH",
		body: payload,
	});
	return res;
};

export const deleteAvatar = async () => {
	const res = await apiFetch<UpdateAvatarResponse>("/user/avatar", {
		method: "DELETE",
	});
	return res;
};

export const updateAvatar = async (file: File) => {
	const formData = new FormData();
	formData.append("avatar", file);

	const res = await apiFetch<UpdateAvatarResponse>("/user/avatar", {
		method: "PATCH",
		body: formData,
	});
	return res;
};

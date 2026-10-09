import { relations } from "drizzle-orm";
import {
	customLists,
	favorites,
	listItems,
	media,
	movieWatchHistory,
	reviewComments,
	tvShowProgress,
	tvShowWatchHistory,
	watchlist,
} from "./list";
import { accounts, activity, users } from "./user";

export const mediaRelations = relations(media, ({ many }) => ({
	movieWatchHistory: many(movieWatchHistory),
	tvShowWatchHistory: many(tvShowWatchHistory),
	tvShowProgress: many(tvShowProgress),
	watchlistEntries: many(watchlist),
	listItems: many(listItems),
	favorites: many(favorites),
}));

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	movieWatchHistory: many(movieWatchHistory),
	tvShowWatchHistory: many(tvShowWatchHistory),
	tvShowProgress: many(tvShowProgress),
	reviewComments: many(reviewComments),
	watchlist: many(watchlist),
	customLists: many(customLists),
	favorites: many(favorites),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const activityRelations = relations(activity, ({ one }) => ({
	user: one(users, {
		fields: [activity.userId],
		references: [users.id],
	}),
	movieWatchHistory: one(movieWatchHistory, {
		fields: [activity.movieWatchHistoryId],
		references: [movieWatchHistory.id],
	}),
	tvShowWatchHistory: one(tvShowWatchHistory, {
		fields: [activity.tvShowWatchHistoryId],
		references: [tvShowWatchHistory.id],
	}),
	tvShowProgress: one(tvShowProgress, {
		fields: [activity.tvShowProgressId],
		references: [tvShowProgress.id],
	}),
	reviewComment: one(reviewComments, {
		fields: [activity.reviewCommentId],
		references: [reviewComments.id],
	}),
	customList: one(customLists, {
		fields: [activity.customListId],
		references: [customLists.id],
	}),
	watchlist: one(watchlist, {
		fields: [activity.watchlistId],
		references: [watchlist.id],
	}),
}));

export const movieWatchHistoryRelations = relations(
	movieWatchHistory,
	({ one, many }) => ({
		user: one(users, {
			fields: [movieWatchHistory.userId],
			references: [users.id],
		}),
		media: one(media, {
			fields: [movieWatchHistory.mediaId],
			references: [media.id],
		}),
		comments: many(reviewComments),
	}),
);

export const tvShowWatchHistoryRelations = relations(
	tvShowWatchHistory,
	({ one, many }) => ({
		user: one(users, {
			fields: [tvShowWatchHistory.userId],
			references: [users.id],
		}),
		media: one(media, {
			fields: [tvShowWatchHistory.mediaId],
			references: [media.id],
		}),
		comments: many(reviewComments),
	}),
);

export const tvShowProgressRelations = relations(tvShowProgress, ({ one }) => ({
	user: one(users, {
		fields: [tvShowProgress.userId],
		references: [users.id],
	}),
	media: one(media, {
		fields: [tvShowProgress.mediaId],
		references: [media.id],
	}),
}));

export const reviewCommentsRelations = relations(reviewComments, ({ one }) => ({
	user: one(users, {
		fields: [reviewComments.userId],
		references: [users.id],
	}),
	movieWatchHistory: one(movieWatchHistory, {
		fields: [reviewComments.movieWatchHistoryId],
		references: [movieWatchHistory.id],
	}),
	tvShowWatchHistory: one(tvShowWatchHistory, {
		fields: [reviewComments.tvShowWatchHistoryId],
		references: [tvShowWatchHistory.id],
	}),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
	user: one(users, {
		fields: [watchlist.userId],
		references: [users.id],
	}),
	media: one(media, {
		fields: [watchlist.mediaId],
		references: [media.id],
	}),
}));

export const customListsRelations = relations(customLists, ({ one, many }) => ({
	user: one(users, {
		fields: [customLists.userId],
		references: [users.id],
	}),
	items: many(listItems),
}));

export const listItemsRelations = relations(listItems, ({ one }) => ({
	list: one(customLists, {
		fields: [listItems.listId],
		references: [customLists.id],
	}),
	media: one(media, {
		fields: [listItems.mediaId],
		references: [media.id],
	}),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
	user: one(users, {
		fields: [favorites.userId],
		references: [users.id],
	}),
	media: one(media, {
		fields: [favorites.mediaId],
		references: [media.id],
	}),
}));

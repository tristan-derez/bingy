import {
	InferInsertModel,
	InferSelectModel,
	relations,
	sql,
} from "drizzle-orm";
import {
	check,
	index,
	integer,
	numeric,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./column.helper";
import { users } from "./user";

export const movieWatchHistory = pgTable(
	"movie_watch_history",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		mediaTmdbId: integer("media_tmdb_id").notNull(),
		rating: numeric("rating", { precision: 2, scale: 1 }),
		review: text("review"),
		loggedAt: timestamp("logged_at").notNull().defaultNow(),
		watchedAt: timestamp("watched_at"),
	},
	(table) => [
		check(
			"rating_range",
			sql`${table.rating} >= 0.5 AND ${table.rating} <= 5.0`,
		),
		index("idx_movie_watch_user").on(table.userId),
		index("idx_movie_watch_media").on(table.mediaTmdbId),
		index("idx_movie_watch_date").on(table.watchedAt),
	],
);

export const tvShowWatchHistory = pgTable(
	"tv_show_watch_history",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		mediaTmdbId: integer("media_tmdb_id").notNull(),
		seasonNumber: integer("season_number").notNull(),
		episodeNumber: integer("episode_number").notNull(),
		rating: numeric("rating", { precision: 2, scale: 1 }),
		review: text("review"),
		loggedAt: timestamp("logged_at").notNull().defaultNow(),
		watchedAt: timestamp("watched_at"),
	},
	(table) => [
		check(
			"rating_range",
			sql`${table.rating} >= 0.5 AND ${table.rating} <= 5.0`,
		),
		index("idx_tv_show_watch_user").on(table.userId),
		index("idx_tv_show_watch_media").on(table.mediaTmdbId),
		index("idx_tv_show_watch_date").on(table.watchedAt),
	],
);

export const reviewComments = pgTable(
	"review_comments",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		movieWatchHistoryId: uuid("movie_watch_history_id").references(
			() => movieWatchHistory.id,
			{ onDelete: "cascade" },
		),
		tvShowWatchHistoryId: uuid("tv_show_watch_history_id").references(
			() => tvShowWatchHistory.id,
			{ onDelete: "cascade" },
		),
		comment: text("comment").notNull(),
		...timestamps,
	},
	(table) => [
		index("idx_review_comments_movie").on(table.movieWatchHistoryId),
		index("idx_review_comments_tv").on(table.tvShowWatchHistoryId),
		index("idx_review_comments_user").on(table.userId),
	],
);

export const watchlist = pgTable(
	"watchlist",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		mediaTmdbId: integer("media_tmdb_id").notNull(),
		mediaType: varchar("media_type", { length: 10 }).notNull(),
		addedAt: timestamp("added_at").notNull().defaultNow(),
	},
	(table) => [unique().on(table.userId, table.mediaTmdbId, table.mediaType)],
);

export const customLists = pgTable(
	"custom_lists",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 256 }).notNull(),
		...timestamps,
	},
	(table) => [index("idx_custom_lists_user").on(table.userId)],
);

export const listItems = pgTable(
	"list_items",
	{
		listId: uuid("list_id")
			.notNull()
			.references(() => customLists.id, { onDelete: "cascade" }),
		mediaTmdbId: integer("media_tmdb_id").notNull(),
		mediaType: varchar("media_type", { length: 10 }).notNull(),
		addedAt: timestamp("added_at").notNull().defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.listId, table.mediaTmdbId, table.mediaType] }),
		index("idx_list_items_list").on(table.listId),
	],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	movieWatchHistory: many(movieWatchHistory),
	tvShowWatchHistory: many(tvShowWatchHistory),
	reviewComments: many(reviewComments),
	watchlist: many(watchlist),
	customLists: many(customLists),
}));

export const movieWatchHistoryRelations = relations(
	movieWatchHistory,
	({ one, many }) => ({
		user: one(users, {
			fields: [movieWatchHistory.userId],
			references: [users.id],
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
		comments: many(reviewComments),
	}),
);

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
}));

// Watch history types
export type MovieWatchHistory = InferSelectModel<typeof movieWatchHistory>;
export type NewMovieWatchHistory = InferInsertModel<typeof movieWatchHistory>;

export type TvShowWatchHistory = InferSelectModel<typeof tvShowWatchHistory>;
export type NewTvShowWatchHistory = InferInsertModel<typeof tvShowWatchHistory>;

// Review comment types
export type ReviewComment = InferSelectModel<typeof reviewComments>;
export type NewReviewComment = InferInsertModel<typeof reviewComments>;

// List types
export type Watchlist = InferSelectModel<typeof watchlist>;
export type NewWatchlist = InferInsertModel<typeof watchlist>;

export type CustomList = InferSelectModel<typeof customLists>;
export type NewCustomList = InferInsertModel<typeof customLists>;

export type ListItem = InferSelectModel<typeof listItems>;
export type NewListItem = InferInsertModel<typeof listItems>;

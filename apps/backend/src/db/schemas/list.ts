import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
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

export const media = pgTable(
	"media",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		tmdbId: integer("tmdb_id").notNull(),
		mediaType: varchar("media_type", { length: 10 }).notNull(),
		averageRating: numeric("average_rating", { precision: 2, scale: 1 }),
		ratingCount: integer("rating_count").notNull().default(0),
		...timestamps,
	},
	(table) => [
		unique().on(table.tmdbId, table.mediaType),
		index("idx_media_type").on(table.mediaType),
		index("idx_media_rating").on(table.averageRating),
		index("idx_media_tmdb").on(table.tmdbId),
	],
);

export const movieWatchHistory = pgTable(
	"movie_watch_history",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		mediaId: uuid("media_id")
			.notNull()
			.references(() => media.id, { onDelete: "cascade" }),
		rating: numeric("rating", { precision: 2, scale: 1 }),
		review: text("review"),
		loggedAt: timestamp("logged_at").notNull().defaultNow(),
		watchedAt: timestamp("watched_at"),
	},
	(table) => [
		unique().on(table.userId, table.mediaId),
		check(
			"rating_range",
			sql`${table.rating} >= 0.5 AND ${table.rating} <= 5.0`,
		),
		index("idx_movie_watch_user").on(table.userId),
		index("idx_movie_watch_media").on(table.mediaId),
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
		mediaId: uuid("media_id")
			.notNull()
			.references(() => media.id, { onDelete: "cascade" }),
		rating: numeric("rating", { precision: 2, scale: 1 }),
		review: text("review"),
		loggedAt: timestamp("logged_at").notNull().defaultNow(),
		watchedAt: timestamp("watched_at"),
	},
	(table) => [
		unique().on(table.userId, table.mediaId),
		check(
			"rating_range",
			sql`${table.rating} >= 0.5 AND ${table.rating} <= 5.0`,
		),
		index("idx_tv_show_watch_user").on(table.userId),
		index("idx_tv_show_watch_media").on(table.mediaId),
		index("idx_tv_show_watch_date").on(table.watchedAt),
	],
);

export const tvShowProgress = pgTable(
	"tv_show_progress",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		mediaId: uuid("media_id")
			.notNull()
			.references(() => media.id, { onDelete: "cascade" }),
		lastWatchedSeason: integer("last_watched_season").notNull(),
		lastWatchedEpisode: integer("last_watched_episode").notNull(),
		absoluteEpisode: integer("absolute_episode"),
		trackingMode: text("tracking_mode").notNull().default("season"),
		status: varchar("status", { length: 20 })
			.notNull()
			.default("watching")
			.$type<"watching" | "completed" | "on_hold" | "dropped">(),
		...timestamps,
	},
	(table) => [
		unique().on(table.userId, table.mediaId),
		index("idx_tv_show_progress_user").on(table.userId),
		index("idx_tv_show_progress_media").on(table.mediaId),
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
		check(
			"review_comment_target_check",
			sql`((movie_watch_history_id IS NOT NULL)::int + (tv_show_watch_history_id IS NOT NULL)::int) = 1`,
		),
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
		mediaId: uuid("media_id")
			.notNull()
			.references(() => media.id, { onDelete: "cascade" }),
		addedAt: timestamp("added_at").notNull().defaultNow(),
	},
	(table) => [
		unique().on(table.userId, table.mediaId),
		index("idx_watchlist_user").on(table.userId),
		index("idx_watchlist_media").on(table.mediaId),
	],
);

export const favorites = pgTable(
	"favorites",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		mediaId: uuid("media_id")
			.notNull()
			.references(() => media.id, { onDelete: "cascade" }),
		addedAt: timestamp("added_at").notNull().defaultNow(),
	},
	(table) => [
		unique().on(table.userId, table.mediaId),
		index("idx_favorites_user").on(table.userId),
		index("idx_favorites_media").on(table.mediaId),
	],
);

export const customLists = pgTable(
	"custom_lists",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 200 }).notNull(),
		slug: varchar("slug", { length: 300 }).notNull(),
		type: varchar("type", { length: 20 })
			.notNull()
			.default("unranked")
			.$type<"unranked" | "ranked">(),
		description: varchar("description", { length: 2000 }),
		visibility: varchar("visibility", { length: 20 })
			.notNull()
			.default("public")
			.$type<"private" | "public" | "limited">(),
		...timestamps,
	},
	(table) => [
		index("idx_custom_lists_user").on(table.userId),
		unique("unique_user_name").on(table.userId, table.name),
		unique("unique_user_slug").on(table.userId, table.slug),
	],
);

export const listItems = pgTable(
	"list_items",
	{
		listId: uuid("list_id")
			.notNull()
			.references(() => customLists.id, { onDelete: "cascade" }),
		mediaId: uuid("media_id")
			.notNull()
			.references(() => media.id, { onDelete: "cascade" }),
		position: integer("position"), // null for unranked
		note: varchar("note", { length: 1000 }),
		addedAt: timestamp("added_at").notNull().defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.listId, table.mediaId] }),
		index("idx_list_items_list").on(table.listId),
		index("idx_list_items_media").on(table.mediaId),
		index("idx_list_items_position").on(table.listId, table.position),
		unique("unique_list_position").on(table.listId, table.position),
	],
);

// Media types
export type Media = InferSelectModel<typeof media>;
export type NewMedia = InferInsertModel<typeof media>;

// Watch history types
export type MovieWatchHistory = InferSelectModel<typeof movieWatchHistory>;
export type NewMovieWatchHistory = InferInsertModel<typeof movieWatchHistory>;

export type TvShowWatchHistory = InferSelectModel<typeof tvShowWatchHistory>;
export type NewTvShowWatchHistory = InferInsertModel<typeof tvShowWatchHistory>;

export type TvShowProgress = InferSelectModel<typeof tvShowProgress>;
export type NewTvShowProgress = InferInsertModel<typeof tvShowProgress>;

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

// favorites
export type Favorite = InferSelectModel<typeof favorites>;
export type NewFavorite = InferInsertModel<typeof favorites>;

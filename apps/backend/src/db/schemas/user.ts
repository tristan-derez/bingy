import {
	type InferInsertModel,
	type InferSelectModel,
	relations,
	sql,
} from "drizzle-orm";
import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./column.helper";
import {
	customLists,
	movieWatchHistory,
	reviewComments,
	tvShowWatchHistory,
	watchlist,
} from "./list";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().default(sql`uuidv7()`),
	name: varchar("name", { length: 30 }),
	email: varchar("email", { length: 256 }).unique().notNull(),
	avatarUrl: text("avatar_url"),
	emailVerified: boolean("email_verified").default(false).notNull(),
	emailVerifiedAt: timestamp("email_verified_at"),
	twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
	lastLoginMethod: text("last_login_method"),
	...timestamps,
});

export const accounts = pgTable(
	"accounts",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text(),
		idToken: text("id_token"),
		passwordHash: text("password_hash"),
		...timestamps,
	},
	(table) => [
		uniqueIndex("unique_user_provider").on(table.userId, table.providerId),
		uniqueIndex("unique_provider_account").on(
			table.providerId,
			table.accountId,
		),
		index("idx_accounts_provider").on(table.providerId),
	],
);

export const two_factor = pgTable("two_factor", {
	id: uuid("id").primaryKey().default(sql`uuidv7()`),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	secret: text(),
	backupCodes: text("backup_codes"),
});

export const sessions = pgTable(
	"sessions",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		token: text().notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		...timestamps,
	},
	(table) => [uniqueIndex("unique_session_token").on(table.token)],
);

export const activity = pgTable(
	"activity",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		activityType: varchar("activity_type", { length: 50 }).notNull(),
		// Polymorphic references - only one should be set per activity
		movieWatchHistoryId: uuid("movie_watch_history_id").references(
			() => movieWatchHistory.id,
			{ onDelete: "cascade" },
		),
		tvShowWatchHistoryId: uuid("tv_show_watch_history_id").references(
			() => tvShowWatchHistory.id,
			{ onDelete: "cascade" },
		),
		reviewCommentId: uuid("review_comment_id").references(
			() => reviewComments.id,
			{ onDelete: "cascade" },
		),
		customListId: uuid("custom_list_id").references(() => customLists.id, {
			onDelete: "cascade",
		}),
		watchlistId: uuid("watchlist_id").references(() => watchlist.id, {
			onDelete: "cascade",
		}),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		index("idx_user_activity_user_date").on(table.userId, table.createdAt),
		index("idx_user_activity_type").on(table.activityType),
	],
);

export const verifications = pgTable("verifications", {
	id: uuid("id").primaryKey().default(sql`uuidv7()`),
	identifier: text(),
	value: text(),
	expiresAt: timestamp("expires_at").notNull(),
	...timestamps,
});

export const userRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
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

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;
export type Activity = InferSelectModel<typeof activity>;
export type NewActivity = InferInsertModel<typeof activity>;

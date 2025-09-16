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

export const users = pgTable("users", {
	id: uuid("id").primaryKey().default(sql`uuidv7()`),
	name: varchar("name", { length: 256 }),
	email: varchar("email", { length: 256 }).unique().notNull(),
	avatarUrl: text("avatar_url"),
	emailVerified: boolean("email_verified").default(false).notNull(),
	emailVerifiedAt: timestamp("email_verified_at"),
	twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
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

export const verifications = pgTable("verifications", {
	id: uuid("id").primaryKey().default(sql`uuidv7()`),
	identifier: text(),
	value: text(),
	expiresAt: timestamp("expires_at").notNull(),
	...timestamps,
});

export const codes = pgTable(
	"codes",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		code: varchar("code", { length: 6 }).notNull(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		...timestamps,
	},
	(table) => [uniqueIndex("unique_code_user").on(table.userId)],
);

export const userRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const codesRelations = relations(codes, ({ one }) => ({
	user: one(users, {
		fields: [codes.userId],
		references: [users.id],
	}),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;

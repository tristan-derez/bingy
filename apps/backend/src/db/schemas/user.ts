import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./column.helper";

export const users = pgTable("users", {
	id: bigint({ mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
	name: varchar("name", { length: 256 }),
	email: varchar("email", { length: 256 }).unique().notNull(),
	password: text(),
	avatar_url: text(),
	email_verified: boolean(),
	email_verified_at: timestamp(),
	two_factor_method: varchar({ length: 25 }),
	two_factor_enabled_at: timestamp(),
	last_login_at: timestamp(),
	...timestamps,
});

export const oauthAccounts = pgTable(
	"oauth_accounts",
	{
		id: bigint({ mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
		user_id: bigint({ mode: "bigint" })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		provider: varchar({ length: 50 }).notNull(),
		provider_account_id: varchar({ length: 255 }).notNull(),
		access_token: text(),
		refresh_token: text(),
		scope: varchar({ length: 255 }),
		...timestamps,
	},
	(table) => [
		uniqueIndex("unique_user_provider").on(table.user_id, table.provider),
	],
);

export const userRelations = relations(users, ({ many }) => ({
	oauthAccount: many(oauthAccounts),
}));

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
	user: one(users, {
		fields: [oauthAccounts.user_id],
		references: [users.id],
	}),
}));

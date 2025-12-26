CREATE TABLE "custom_lists" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "list_items" (
	"list_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "list_items_list_id_media_id_pk" PRIMARY KEY("list_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"tmdb_id" integer NOT NULL,
	"media_type" varchar(10) NOT NULL,
	"average_rating" numeric(2, 1),
	"rating_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "media_tmdb_id_media_type_unique" UNIQUE("tmdb_id","media_type")
);
--> statement-breakpoint
CREATE TABLE "movie_watch_history" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"rating" numeric(2, 1),
	"review" text,
	"logged_at" timestamp DEFAULT now() NOT NULL,
	"watched_at" timestamp,
	CONSTRAINT "movie_watch_history_user_id_media_id_unique" UNIQUE("user_id","media_id"),
	CONSTRAINT "rating_range" CHECK ("movie_watch_history"."rating" >= 0.5 AND "movie_watch_history"."rating" <= 5.0)
);
--> statement-breakpoint
CREATE TABLE "review_comments" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"movie_watch_history_id" uuid,
	"tv_show_watch_history_id" uuid,
	"comment" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "review_comment_target_check" CHECK (((movie_watch_history_id IS NOT NULL)::int + (tv_show_watch_history_id IS NOT NULL)::int) = 1)
);
--> statement-breakpoint
CREATE TABLE "tv_seasons" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"media_id" uuid NOT NULL,
	"season_number" integer NOT NULL,
	"episode_count" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "tv_seasons_media_id_season_number_unique" UNIQUE("media_id","season_number")
);
--> statement-breakpoint
CREATE TABLE "tv_show_progress" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"last_watched_season" integer NOT NULL,
	"last_watched_episode" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "tv_show_progress_user_id_media_id_unique" UNIQUE("user_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "tv_show_watch_history" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"rating" numeric(2, 1),
	"review" text,
	"logged_at" timestamp DEFAULT now() NOT NULL,
	"watched_at" timestamp,
	CONSTRAINT "tv_show_watch_history_user_id_media_id_unique" UNIQUE("user_id","media_id"),
	CONSTRAINT "rating_range" CHECK ("tv_show_watch_history"."rating" >= 0.5 AND "tv_show_watch_history"."rating" <= 5.0)
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "watchlist_user_id_media_id_unique" UNIQUE("user_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"id_token" text,
	"password_hash" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "activity" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"movie_watch_history_id" uuid,
	"tv_show_watch_history_id" uuid,
	"tv_show_progress_id" uuid,
	"review_comment_id" uuid,
	"custom_list_id" uuid,
	"watchlist_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "two_factor" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"secret" text,
	"backup_codes" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" varchar(30),
	"email" varchar(256) NOT NULL,
	"avatar_url" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"email_verified_at" timestamp,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"last_login_method" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"identifier" text,
	"value" text,
	"expires_at" timestamp NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "custom_lists" ADD CONSTRAINT "custom_lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_list_id_custom_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."custom_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_watch_history" ADD CONSTRAINT "movie_watch_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_watch_history" ADD CONSTRAINT "movie_watch_history_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_movie_watch_history_id_movie_watch_history_id_fk" FOREIGN KEY ("movie_watch_history_id") REFERENCES "public"."movie_watch_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_tv_show_watch_history_id_tv_show_watch_history_id_fk" FOREIGN KEY ("tv_show_watch_history_id") REFERENCES "public"."tv_show_watch_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tv_seasons" ADD CONSTRAINT "tv_seasons_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tv_show_progress" ADD CONSTRAINT "tv_show_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tv_show_progress" ADD CONSTRAINT "tv_show_progress_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tv_show_watch_history" ADD CONSTRAINT "tv_show_watch_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tv_show_watch_history" ADD CONSTRAINT "tv_show_watch_history_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_movie_watch_history_id_movie_watch_history_id_fk" FOREIGN KEY ("movie_watch_history_id") REFERENCES "public"."movie_watch_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_tv_show_watch_history_id_tv_show_watch_history_id_fk" FOREIGN KEY ("tv_show_watch_history_id") REFERENCES "public"."tv_show_watch_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_tv_show_progress_id_tv_show_progress_id_fk" FOREIGN KEY ("tv_show_progress_id") REFERENCES "public"."tv_show_progress"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_review_comment_id_review_comments_id_fk" FOREIGN KEY ("review_comment_id") REFERENCES "public"."review_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_custom_list_id_custom_lists_id_fk" FOREIGN KEY ("custom_list_id") REFERENCES "public"."custom_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_watchlist_id_watchlist_id_fk" FOREIGN KEY ("watchlist_id") REFERENCES "public"."watchlist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_custom_lists_user" ON "custom_lists" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_list_items_list" ON "list_items" USING btree ("list_id");--> statement-breakpoint
CREATE INDEX "idx_list_items_media" ON "list_items" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "idx_media_type" ON "media" USING btree ("media_type");--> statement-breakpoint
CREATE INDEX "idx_media_rating" ON "media" USING btree ("average_rating");--> statement-breakpoint
CREATE INDEX "idx_media_tmdb" ON "media" USING btree ("tmdb_id");--> statement-breakpoint
CREATE INDEX "idx_movie_watch_user" ON "movie_watch_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_movie_watch_media" ON "movie_watch_history" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "idx_movie_watch_date" ON "movie_watch_history" USING btree ("watched_at");--> statement-breakpoint
CREATE INDEX "idx_review_comments_movie" ON "review_comments" USING btree ("movie_watch_history_id");--> statement-breakpoint
CREATE INDEX "idx_review_comments_tv" ON "review_comments" USING btree ("tv_show_watch_history_id");--> statement-breakpoint
CREATE INDEX "idx_review_comments_user" ON "review_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tv_seasons_media" ON "tv_seasons" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "idx_tv_show_progress_user" ON "tv_show_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tv_show_progress_media" ON "tv_show_progress" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "idx_tv_show_watch_user" ON "tv_show_watch_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tv_show_watch_media" ON "tv_show_watch_history" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "idx_watchlist_user" ON "watchlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_watchlist_media" ON "watchlist" USING btree ("media_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_provider" ON "accounts" USING btree ("user_id","provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_provider_account" ON "accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "idx_accounts_provider" ON "accounts" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_user_activity_user_date" ON "activity" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_user_activity_type" ON "activity" USING btree ("activity_type");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_session_token" ON "sessions" USING btree ("token");
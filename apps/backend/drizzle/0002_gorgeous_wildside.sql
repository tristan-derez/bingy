CREATE TABLE "activity" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"movie_watch_history_id" uuid,
	"tv_show_watch_history_id" uuid,
	"review_comment_id" uuid,
	"custom_list_id" uuid,
	"watchlist_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "idx_watchlist_user";--> statement-breakpoint
ALTER TABLE "watchlist" DROP CONSTRAINT "watchlist_user_id_media_tmdb_id_media_type_pk";--> statement-breakpoint
ALTER TABLE "watchlist" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_movie_watch_history_id_movie_watch_history_id_fk" FOREIGN KEY ("movie_watch_history_id") REFERENCES "public"."movie_watch_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_tv_show_watch_history_id_tv_show_watch_history_id_fk" FOREIGN KEY ("tv_show_watch_history_id") REFERENCES "public"."tv_show_watch_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_review_comment_id_review_comments_id_fk" FOREIGN KEY ("review_comment_id") REFERENCES "public"."review_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_custom_list_id_custom_lists_id_fk" FOREIGN KEY ("custom_list_id") REFERENCES "public"."custom_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_watchlist_id_watchlist_id_fk" FOREIGN KEY ("watchlist_id") REFERENCES "public"."watchlist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_user_activity_user_date" ON "activity" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_user_activity_type" ON "activity" USING btree ("activity_type");--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_media_tmdb_id_media_type_unique" UNIQUE("user_id","media_tmdb_id","media_type");
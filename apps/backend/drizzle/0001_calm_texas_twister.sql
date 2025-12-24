CREATE TABLE "review_comments" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"movie_watch_history_id" uuid,
	"tv_show_watch_history_id" uuid,
	"comment" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "movie_watch_history" ALTER COLUMN "watched_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "movie_watch_history" ALTER COLUMN "watched_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tv_show_watch_history" ALTER COLUMN "watched_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tv_show_watch_history" ALTER COLUMN "watched_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "movie_watch_history" ADD COLUMN "rating" numeric(2, 1);--> statement-breakpoint
ALTER TABLE "movie_watch_history" ADD COLUMN "review" text;--> statement-breakpoint
ALTER TABLE "movie_watch_history" ADD COLUMN "logged_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tv_show_watch_history" ADD COLUMN "rating" numeric(2, 1);--> statement-breakpoint
ALTER TABLE "tv_show_watch_history" ADD COLUMN "review" text;--> statement-breakpoint
ALTER TABLE "tv_show_watch_history" ADD COLUMN "logged_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_movie_watch_history_id_movie_watch_history_id_fk" FOREIGN KEY ("movie_watch_history_id") REFERENCES "public"."movie_watch_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_tv_show_watch_history_id_tv_show_watch_history_id_fk" FOREIGN KEY ("tv_show_watch_history_id") REFERENCES "public"."tv_show_watch_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_review_comments_movie" ON "review_comments" USING btree ("movie_watch_history_id");--> statement-breakpoint
CREATE INDEX "idx_review_comments_tv" ON "review_comments" USING btree ("tv_show_watch_history_id");--> statement-breakpoint
CREATE INDEX "idx_review_comments_user" ON "review_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_movie_watch_date" ON "movie_watch_history" USING btree ("watched_at");--> statement-breakpoint
CREATE INDEX "idx_tv_show_watch_date" ON "tv_show_watch_history" USING btree ("watched_at");--> statement-breakpoint
ALTER TABLE "movie_watch_history" ADD CONSTRAINT "rating_range" CHECK ("movie_watch_history"."rating" >= 0.5 AND "movie_watch_history"."rating" <= 5.0);--> statement-breakpoint
ALTER TABLE "tv_show_watch_history" ADD CONSTRAINT "rating_range" CHECK ("tv_show_watch_history"."rating" >= 0.5 AND "tv_show_watch_history"."rating" <= 5.0);
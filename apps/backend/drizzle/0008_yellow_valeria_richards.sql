DROP TABLE "tv_seasons" CASCADE;--> statement-breakpoint
ALTER TABLE "tv_show_progress" ADD COLUMN "status" varchar(20) DEFAULT 'watching' NOT NULL;
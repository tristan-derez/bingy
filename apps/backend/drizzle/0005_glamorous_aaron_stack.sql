ALTER TABLE "users" ADD COLUMN "bio" varchar(30);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_display_name_unique" UNIQUE("display_name");
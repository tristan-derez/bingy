ALTER TABLE "custom_lists" ALTER COLUMN "name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "custom_lists" ADD COLUMN "visibility" varchar(20) DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "list_items" ADD COLUMN "note" varchar(500);
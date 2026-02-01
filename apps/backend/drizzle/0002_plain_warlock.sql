ALTER TABLE "custom_lists" ADD COLUMN "type" varchar(20) DEFAULT 'unranked' NOT NULL;--> statement-breakpoint
ALTER TABLE "list_items" ADD COLUMN "position" integer;--> statement-breakpoint
CREATE INDEX "idx_list_items_position" ON "list_items" USING btree ("list_id","position");--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "unique_list_position" UNIQUE("list_id","position");
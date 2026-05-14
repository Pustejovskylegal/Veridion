CREATE TYPE "public"."change_significance" AS ENUM('critical', 'important', 'minor');--> statement-breakpoint
CREATE TABLE "tender_changes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tender_id" uuid NOT NULL,
	"run_id" uuid,
	"field" text NOT NULL,
	"old_value" jsonb,
	"new_value" jsonb,
	"significance" "change_significance" DEFAULT 'minor' NOT NULL,
	"detected_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tender_changes" ADD CONSTRAINT "tender_changes_tender_id_tenders_id_fk" FOREIGN KEY ("tender_id") REFERENCES "public"."tenders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tender_changes" ADD CONSTRAINT "tender_changes_run_id_tender_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."tender_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tender_changes_tender_idx" ON "tender_changes" USING btree ("tender_id","detected_at");--> statement-breakpoint
CREATE INDEX "tender_changes_detected_idx" ON "tender_changes" USING btree ("detected_at");
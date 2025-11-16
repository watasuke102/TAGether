CREATE TYPE "public"."severity" AS ENUM('DEBUG', 'INFO', 'WARN', 'ERROR');--> statement-breakpoint
CREATE TABLE "category_update_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"cause_user" uuid NOT NULL,
	"category_id" integer NOT NULL,
	"old_list" text NOT NULL,
	"new_list" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"cause_user" uuid,
	"severity" "severity" NOT NULL,
	"path" text NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category_update_log" ADD CONSTRAINT "category_update_log_cause_user_users_uid_fk" FOREIGN KEY ("cause_user") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_update_log" ADD CONSTRAINT "category_update_log_category_id_exam_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."exam"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_cause_user_users_uid_fk" FOREIGN KEY ("cause_user") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;
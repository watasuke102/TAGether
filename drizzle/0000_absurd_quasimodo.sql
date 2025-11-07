CREATE TABLE "exam" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"version" integer DEFAULT 2 NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tag" text NOT NULL,
	"list" text NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"original_title" text NOT NULL,
	"redo_times" integer DEFAULT 0 NOT NULL,
	"exam_state" json NOT NULL,
	"exam" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"body" text NOT NULL,
	"answer" text
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"uid" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"favorite_list" text DEFAULT '[]'
);
--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_owner_users_uid_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;
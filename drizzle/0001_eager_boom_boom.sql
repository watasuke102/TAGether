CREATE TABLE "email_login_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expire_at" timestamp NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passkeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner" uuid NOT NULL,
	"credential_id" text NOT NULL,
	"public_key" text NOT NULL,
	"counter" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "owner" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "uid" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "uid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_owner_users_uid_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;
CREATE TABLE "otp_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"attempted_at" timestamp DEFAULT now() NOT NULL
);

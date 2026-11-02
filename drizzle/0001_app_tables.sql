CREATE TYPE "public"."sync_status" AS ENUM('idle', 'syncing', 'failed');--> statement-breakpoint
CREATE TABLE "cf_profile" (
	"handle" text PRIMARY KEY NOT NULL,
	"owner_user_id" text,
	"rating" integer,
	"max_rating" integer,
	"rank" text,
	"max_rank" text,
	"avatar_url" text,
	"verified_at" timestamp with time zone,
	"last_synced_at" timestamp with time zone,
	"last_viewed_at" timestamp with time zone,
	"sync_status" "sync_status" DEFAULT 'idle' NOT NULL,
	"sync_started_at" timestamp with time zone,
	CONSTRAINT "cf_profile_owner_user_id_unique" UNIQUE("owner_user_id"),
	CONSTRAINT "cf_profile_syncing_started_chk" CHECK (("cf_profile"."sync_status" = 'syncing') = ("cf_profile"."sync_started_at" is not null))
);
--> statement-breakpoint
CREATE TABLE "contest" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_time" timestamp with time zone,
	"duration_seconds" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contest_participation" (
	"handle" text NOT NULL,
	"contest_id" integer NOT NULL,
	"place" integer NOT NULL,
	"old_rating" integer NOT NULL,
	"new_rating" integer NOT NULL,
	CONSTRAINT "contest_participation_handle_contest_id_pk" PRIMARY KEY("handle","contest_id")
);
--> statement-breakpoint
CREATE TABLE "handle_verification" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "handle_verification_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"handle" text NOT NULL,
	"contest_id" integer NOT NULL,
	"problem_index" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "handle_verification_window_chk" CHECK ("handle_verification"."expires_at" > "handle_verification"."started_at")
);
--> statement-breakpoint
CREATE TABLE "problem" (
	"contest_id" integer NOT NULL,
	"index" text NOT NULL,
	"name" text NOT NULL,
	"rating" integer,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	CONSTRAINT "problem_contest_id_index_pk" PRIMARY KEY("contest_id","index")
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" bigint PRIMARY KEY NOT NULL,
	"handle" text NOT NULL,
	"contest_id" integer NOT NULL,
	"problem_index" text NOT NULL,
	"is_accepted" boolean NOT NULL,
	"in_contest" boolean NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upsolve_note" (
	"user_id" text NOT NULL,
	"contest_id" integer NOT NULL,
	"problem_index" text NOT NULL,
	"is_done" boolean DEFAULT false NOT NULL,
	"note" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "upsolve_note_user_id_contest_id_problem_index_pk" PRIMARY KEY("user_id","contest_id","problem_index")
);
--> statement-breakpoint
ALTER TABLE "cf_profile" ADD CONSTRAINT "cf_profile_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_participation" ADD CONSTRAINT "contest_participation_handle_cf_profile_handle_fk" FOREIGN KEY ("handle") REFERENCES "public"."cf_profile"("handle") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_participation" ADD CONSTRAINT "contest_participation_contest_id_contest_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contest"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handle_verification" ADD CONSTRAINT "handle_verification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem" ADD CONSTRAINT "problem_contest_id_contest_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contest"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_handle_cf_profile_handle_fk" FOREIGN KEY ("handle") REFERENCES "public"."cf_profile"("handle") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_contest_id_problem_index_problem_contest_id_index_fk" FOREIGN KEY ("contest_id","problem_index") REFERENCES "public"."problem"("contest_id","index") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upsolve_note" ADD CONSTRAINT "upsolve_note_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upsolve_note" ADD CONSTRAINT "upsolve_note_contest_id_problem_index_problem_contest_id_index_fk" FOREIGN KEY ("contest_id","problem_index") REFERENCES "public"."problem"("contest_id","index") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cf_profile_handle_lower_idx" ON "cf_profile" USING btree (lower("handle"));--> statement-breakpoint
CREATE INDEX "handle_verification_user_id_idx" ON "handle_verification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "submission_handle_problem_idx" ON "submission" USING btree ("handle","contest_id","problem_index");
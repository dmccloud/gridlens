CREATE TABLE "f1-project_constructors" (
	"id" serial PRIMARY KEY NOT NULL,
	"constructor_id" text NOT NULL,
	"name" text NOT NULL,
	"nationality" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "f1-project_drivers" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(3) NOT NULL,
	"driver_id" text NOT NULL,
	"given_name" text NOT NULL,
	"family_name" text NOT NULL,
	"nationality" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "f1-project_races" (
	"id" serial PRIMARY KEY NOT NULL,
	"season" integer NOT NULL,
	"round" integer NOT NULL,
	"race_name" text NOT NULL,
	"circuit_name" text NOT NULL,
	"country" text NOT NULL,
	"locality" text NOT NULL,
	"date" date NOT NULL,
	"time" text
);
--> statement-breakpoint
CREATE TABLE "f1-project_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"race_id" integer NOT NULL,
	"driver_id" integer NOT NULL,
	"constructor_id" integer NOT NULL,
	"grid" integer NOT NULL,
	"position" integer,
	"status" text NOT NULL,
	"points" numeric(5, 2) NOT NULL,
	"fastest_lap" integer,
	"time_millis" integer
);
--> statement-breakpoint
DROP TABLE "f1-project_post" CASCADE;--> statement-breakpoint
ALTER TABLE "f1-project_results" ADD CONSTRAINT "f1-project_results_race_id_f1-project_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."f1-project_races"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "f1-project_results" ADD CONSTRAINT "f1-project_results_driver_id_f1-project_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."f1-project_drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "f1-project_results" ADD CONSTRAINT "f1-project_results_constructor_id_f1-project_constructors_id_fk" FOREIGN KEY ("constructor_id") REFERENCES "public"."f1-project_constructors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "constructors_id_idx" ON "f1-project_constructors" USING btree ("constructor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "drivers_driverId_idx" ON "f1-project_drivers" USING btree ("driver_id");--> statement-breakpoint
CREATE UNIQUE INDEX "races_season_round_idx" ON "f1-project_races" USING btree ("season","round");--> statement-breakpoint
CREATE UNIQUE INDEX "results_race_driver_idx" ON "f1-project_results" USING btree ("race_id","driver_id");
// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  pgTableCreator,
  serial,
  integer,
  text,
  varchar,
  date,
  numeric,
  uniqueIndex,
} from "drizzle-orm/pg-core";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `f1-project_${name}`);

export const drivers = createTable(
  "drivers",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 3 }).notNull(),
    driverId: text("driver_id").notNull(), // "max_verstappen"
    givenName: text("given_name").notNull(),
    familyName: text("family_name").notNull(),
    nationality: text("nationality").notNull(),
  },
  (t) => ({ uniq: uniqueIndex("drivers_driverId_idx").on(t.driverId) }),
);

export const constructors = createTable(
  "constructors",
  {
    id: serial("id").primaryKey(),
    constructorId: text("constructor_id").notNull(), // "red_bull"
    name: text("name").notNull(),
    nationality: text("nationality").notNull(),
  },
  (t) => ({ uniq: uniqueIndex("constructors_id_idx").on(t.constructorId) }),
);

export const races = createTable(
  "races",
  {
    id: serial("id").primaryKey(),
    season: integer("season").notNull(),
    round: integer("round").notNull(),
    raceName: text("race_name").notNull(),
    circuitName: text("circuit_name").notNull(),
    country: text("country").notNull(),
    locality: text("locality").notNull(),
    date: date("date").notNull(),
    time: text("time"), // ISO string if available
  },
  (t) => ({
    uniq: uniqueIndex("races_season_round_idx").on(t.season, t.round),
  }),
);

export const results = createTable(
  "results",
  {
    id: serial("id").primaryKey(),
    raceId: integer("race_id")
      .notNull()
      .references(() => races.id),
    driverId: integer("driver_id")
      .notNull()
      .references(() => drivers.id),
    constructorId: integer("constructor_id")
      .notNull()
      .references(() => constructors.id),
    grid: integer("grid").notNull(),
    position: integer("position"),
    status: text("status").notNull(), // Finished, +1 Lap, DNF, etc.
    points: numeric("points", { precision: 5, scale: 2 }).notNull(),
    fastestLap: integer("fastest_lap"),
    timeMillis: integer("time_millis"), // race time in ms if available
  },
  (t) => ({
    uniq: uniqueIndex("results_race_driver_idx").on(t.raceId, t.driverId),
  }),
);

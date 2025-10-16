import { db } from "@/server/db";
import { races } from "@/server/db/schema";

export type Circuit = {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
};

export type Session = { date: string; time: string };

export type RaceTable = {
  Races: {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time: string;
    FirstPractice: Session;
    SecondPractice: Session;
    ThirdPractice: Session;
    Qualifying: Session;
    Sprint: Session;
  }[];
};

export type MRData = {
  MRData: {
    limit: string;
    offset: string;
    total: string;
    RaceTable: RaceTable;
  };
};

type RaceRow = typeof races.$inferInsert;

const base = "https://api.jolpi.ca/ergast/f1";

export const getSeasonRaces = async (year: number) => {
  const response = await fetch(`${base}/${year}.json`);
  const data = (await response.json()) as MRData;
  return data.MRData.RaceTable;
};

export const seedSeason = async (year: number) => {
  const raceList = await getSeasonRaces(year);
  const raceRows: RaceRow[] = raceList.Races.map((race) => ({
    season: parseInt(race.season),
    round: parseInt(race.round),
    raceName: race.raceName,
    circuitName: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    locality: race.Circuit.Location.locality,
    date: race.date,
    time: race.time,
  }));
  return db.transaction(async (tx) => {
    await tx.insert(races).values(raceRows).onConflictDoNothing();
  });
};

// id: serial("id").primaryKey(),
//     season: integer("season").notNull(),
//     round: integer("round").notNull(),
//     raceName: text("race_name").notNull(),
//     circuitName: text("circuit_name").notNull(),
//     country: text("country").notNull(),
//     locality: text("locality").notNull(),
//     date: date("date").notNull(),
//     time: text("time"), // ISO string if available

"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UpcomingRace = {
  season: number;
  round: number;
  raceName: string;
  circuitName: string;
  country: string;
  locality: string;
  date: string; // YYYY-MM-DD
  time: string | null; // e.g. 14:00:00Z
};

function getTargetDate(date: string, time: string | null) {
  // Ergast times are UTC (often with trailing Z). Default to noon UTC if time missing.
  const iso = time ? `${date}T${time}` : `${date}T12:00:00Z`;
  return new Date(iso);
}

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const totalMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalMs };
}

function formatLocalDateTime(d: Date) {
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
  return `${date} • ${time}`;
}

export function UpcomingRaceCard({ race }: { race?: UpcomingRace }) {
  const target = useMemo(() => {
    const date = race?.date ?? new Date().toISOString().slice(0, 10);
    const time = race?.time ?? null;
    return getTargetDate(date, time);
  }, [race?.date, race?.time]);
  const { days, hours, minutes, seconds } = useCountdown(target);

  if (!race) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Race</CardTitle>
          <CardDescription>No upcoming race found.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Check back later once the calendar updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{race.raceName}</CardTitle>
        <CardAction>
          <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
            Round {race.round} • {race.season}
          </span>
        </CardAction>
        <CardDescription>
          {race.circuitName} — {race.locality}, {race.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            Race start (your time)
          </p>
          <p className="text-lg font-medium">{formatLocalDateTime(target)}</p>
        </div>

        <div className="bg-muted/60 ring-border/60 rounded-xl px-4 py-3 text-center ring-1">
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Starts in
          </p>
          <div className="mt-1 grid grid-cols-4 gap-3">
            <TimeBlock label="Days" value={days} />
            <TimeBlock label="Hours" value={hours} />
            <TimeBlock label="Mins" value={minutes} />
            <TimeBlock label="Secs" value={seconds} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <span className="text-muted-foreground text-xs">
          {race.time
            ? "UTC time provided by schedule"
            : "Approximate local start time (time TBD)"}
        </span>
      </CardFooter>
    </Card>
  );
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background ring-border/60 rounded-lg px-3 py-2 ring-1">
      <div className="font-mono text-xl leading-none tabular-nums">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-muted-foreground mt-1 text-[10px] tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
}

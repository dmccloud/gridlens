import { api, HydrateClient } from "@/trpc/server";
import { UpcomingRaceCard } from "@/app/_components/upcoming-race-card";

export default async function Home() {
  const nextRace = await api.races.getNextRace();

  return (
    <HydrateClient>
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        <section>
          <UpcomingRaceCard race={nextRace?.[0]} />
        </section>
      </main>
    </HydrateClient>
  );
}

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { asc, eq, gte } from "drizzle-orm";
import { races } from "@/server/db/schema";

export const racesRouter = createTRPCRouter({
  getRaces: publicProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(races)
        .where(eq(races.season, input.year));
    }),
  getNextRace: publicProcedure.query(async ({ ctx }) => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD for DATE column
    return await ctx.db
      .select()
      .from(races)
      .where(gte(races.date, today))
      .orderBy(asc(races.date))
      .limit(1);
  }),
});

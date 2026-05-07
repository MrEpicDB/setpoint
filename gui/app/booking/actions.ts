"use server";

import { prisma } from "../lib/prisma";

export async function getSessions() {
  const sessions = await prisma.session.findMany({
    orderBy: { startTime: "asc" },
  });
  return sessions.map((s) => ({
    ...s,
    startTime: s.startTime.toISOString(),
    endTime: s.endTime.toISOString(),
    createdAt: s.createdAt.toISOString(),
  }));
}

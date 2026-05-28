"use server";

import { auth } from "@/auth";
import { prisma } from "../lib/prisma";
import { redirect } from "next/navigation";

export async function getSessions() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const memberships = await prisma.clubMember.findMany({
    where: { userId: session.user.id, status: "APPROVED" },
    select: { clubId: true },
  });

  const clubIds = memberships.map((m) => m.clubId);
  if (clubIds.length === 0) return [];

  const sessions = await prisma.session.findMany({
    where: { clubId: { in: clubIds } },
    include: { club: { select: { name: true } } },
    orderBy: { startTime: "asc" },
  });

  return sessions.map((s) => ({
    id: s.id,
    name: s.name,
    clubName: s.club.name,
    startTime: s.startTime.toISOString(),
    endTime: s.endTime.toISOString(),
  }));
}

export async function getCoachClubs() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const memberships = await prisma.clubMember.findMany({
    where: {
      userId: session.user.id,
      status: "APPROVED",
      role: { in: ["COACH", "ORGANISER"] },
    },
    include: { club: { select: { id: true, name: true } } },
  });

  return memberships.map((m) => ({ id: m.club.id, name: m.club.name }));
}

export async function createSession(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const clubId = formData.get("clubId") as string;

  const membership = await prisma.clubMember.findUnique({
    where: { userId_clubId: { userId: session.user.id, clubId } },
  });
  if (!membership || (membership.role !== "COACH" && membership.role !== "ORGANISER")) {
    return { error: "Not authorised" };
  }

  await prisma.session.create({
    data: {
      clubId,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      agenda: (formData.get("agenda") as string) || null,
      skillLevel: (formData.get("skillLevel") as any) || "BEGINNER",
      capacity: parseInt(formData.get("capacity") as string),
      price: parseInt(formData.get("price") as string),
      startTime: new Date(formData.get("startTime") as string),
      endTime: new Date(formData.get("endTime") as string),
      location: formData.get("location") as string,
    },
  });

  redirect("/booking");
}

export async function updateSession(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sessionId = formData.get("sessionId") as string;
  const clubSession = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!clubSession) redirect("/booking");

  const membership = await prisma.clubMember.findUnique({
    where: { userId_clubId: { userId: session.user.id, clubId: clubSession.clubId } },
  });
  if (!membership || (membership.role !== "COACH" && membership.role !== "ORGANISER")) redirect("/booking");

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      agenda: (formData.get("agenda") as string) || null,
      skillLevel: (formData.get("skillLevel") as any) || "BEGINNER",
      capacity: parseInt(formData.get("capacity") as string),
      price: parseInt(formData.get("price") as string),
      startTime: new Date(formData.get("startTime") as string),
      endTime: new Date(formData.get("endTime") as string),
      location: formData.get("location") as string,
    },
  });

  redirect("/booking");
}

export async function deleteSession(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const clubSession = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!clubSession) redirect("/booking");

  const membership = await prisma.clubMember.findUnique({
    where: { userId_clubId: { userId: session.user.id, clubId: clubSession.clubId } },
  });
  if (!membership || (membership.role !== "COACH" && membership.role !== "ORGANISER")) redirect("/booking");

  await prisma.session.delete({ where: { id: sessionId } });
  redirect("/booking");
}

export async function getSessionById(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const clubSession = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { club: { select: { name: true } } },
  });
  if (!clubSession) return null;

  const membership = await prisma.clubMember.findUnique({
    where: { userId_clubId: { userId: session.user.id, clubId: clubSession.clubId } },
  });

  return {
    ...clubSession,
    startTime: clubSession.startTime.toISOString(),
    endTime: clubSession.endTime.toISOString(),
    createdAt: clubSession.createdAt.toISOString(),
    clubName: clubSession.club.name,
    canEdit: !!membership && (membership.role === "COACH" || membership.role === "ORGANISER"),
  };
}

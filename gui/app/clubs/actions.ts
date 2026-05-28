"use server";

import { auth } from "@/auth";
import { prisma } from "../lib/prisma";
import { redirect } from "next/navigation";

export async function createClub(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const requiresApproval = formData.get("requiresApproval") === "on";

  const club = await prisma.club.create({
    data: {
      name,
      description,
      location,
      requiresApproval,
      members: {
        create: { userId: session.user.id, role: "ORGANISER", status: "APPROVED" },
      },
    },
  });

  redirect(`/clubs/${club.id}`);
}

export async function updateClub(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const clubId = formData.get("clubId") as string;

  const membership = await prisma.clubMember.findUnique({
    where: { userId_clubId: { userId: session.user.id, clubId } },
  });
  if (!membership || membership.role !== "ORGANISER") redirect(`/clubs/${clubId}`);

  await prisma.club.update({
    where: { id: clubId },
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      requiresApproval: formData.get("requiresApproval") === "on",
    },
  });

  redirect(`/clubs/${clubId}`);
}

export async function joinClub(clubId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const club = await prisma.club.findUnique({ where: { id: clubId } });
  if (!club) return { error: "Club not found" };

  await prisma.clubMember.create({
    data: {
      userId: session.user.id,
      clubId,
      status: club.requiresApproval ? "PENDING" : "APPROVED",
    },
  });

  redirect(`/clubs/${clubId}`);
}

export async function updateMemberRole(memberId: string, role: "PLAYER" | "COACH" | "ORGANISER") {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const member = await prisma.clubMember.findUnique({ where: { id: memberId } });
  if (!member) return { error: "Member not found" };

  const callerMembership = await prisma.clubMember.findUnique({
    where: { userId_clubId: { userId: session.user.id, clubId: member.clubId } },
  });
  if (!callerMembership || callerMembership.role !== "ORGANISER") return { error: "Not authorised" };

  await prisma.clubMember.update({ where: { id: memberId }, data: { role } });
  redirect(`/clubs/${member.clubId}`);
}

export async function approveMember(memberId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const member = await prisma.clubMember.findUnique({ where: { id: memberId } });
  if (!member) return { error: "Member not found" };

  const callerMembership = await prisma.clubMember.findUnique({
    where: { userId_clubId: { userId: session.user.id, clubId: member.clubId } },
  });
  if (!callerMembership || callerMembership.role !== "ORGANISER") return { error: "Not authorised" };

  await prisma.clubMember.update({ where: { id: memberId }, data: { status: "APPROVED" } });
  redirect(`/clubs/${member.clubId}`);
}

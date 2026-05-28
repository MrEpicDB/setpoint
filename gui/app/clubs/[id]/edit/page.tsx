import { auth } from "@/auth";
import { prisma } from "../../../lib/prisma";
import { colors } from "../../../colors";
import { notFound, redirect } from "next/navigation";
import { updateClub } from "../../actions";

export default async function EditClubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const club = await prisma.club.findUnique({ where: { id } });
  if (!club) notFound();

  const membership = await prisma.clubMember.findUnique({
    where: { userId_clubId: { userId: session.user.id, clubId: id } },
  });
  if (!membership || membership.role !== "ORGANISER") redirect(`/clubs/${id}`);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
      <form action={updateClub} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: colors.text }}>Edit Club</h1>
        <input type="hidden" name="clubId" value={id} />
        <input name="name" defaultValue={club.name} required className="w-full border p-2 rounded" />
        <textarea name="description" defaultValue={club.description ?? ""} className="w-full border p-2 rounded" rows={3} />
        <input name="location" defaultValue={club.location} required className="w-full border p-2 rounded" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="requiresApproval" defaultChecked={club.requiresApproval} />
          Require approval for new members
        </label>
        <button type="submit" className="w-full py-2 rounded text-white" style={{ backgroundColor: colors.button }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

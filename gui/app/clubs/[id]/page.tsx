import { auth } from "@/auth";
import { prisma } from "../../lib/prisma";
import { colors } from "../../colors";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updateMemberRole, approveMember } from "../actions";

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const club = await prisma.club.findUnique({
    where: { id },
    include: {
      members: { include: { user: true } },
      sessions: { where: { status: "SCHEDULED" }, orderBy: { startTime: "asc" }, take: 5 },
    },
  });

  if (!club) notFound();

  const currentMember = userId ? club.members.find((m) => m.userId === userId) : null;
  const isAdmin = currentMember?.role === "ORGANISER";
  const approvedMembers = club.members.filter((m) => m.status === "APPROVED");
  const pendingMembers = club.members.filter((m) => m.status === "PENDING");

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.text }}>{club.name}</h1>
            <p className="text-gray-600">{club.location}</p>
            {club.description && <p className="mt-2">{club.description}</p>}
          </div>
          {isAdmin && (
            <Link href={`/clubs/${id}/edit`}>
              <button className="px-4 py-2 rounded text-white" style={{ backgroundColor: colors.button }}>
                Edit Club
              </button>
            </Link>
          )}
        </div>

        {club.sessions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>Upcoming Sessions</h2>
            <div className="space-y-2">
              {club.sessions.map((s) => (
                <div key={s.id} className="bg-white p-3 rounded shadow">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(s.startTime).toLocaleDateString()} {new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(s.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {isAdmin && pendingMembers.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>Pending Requests</h2>
            <div className="space-y-2">
              {pendingMembers.map((m) => (
                <div key={m.id} className="bg-white p-3 rounded shadow flex items-center justify-between">
                  <span>{m.user.firstName} {m.user.lastName}</span>
                  <form action={async () => { "use server"; await approveMember(m.id); }}>
                    <button type="submit" className="px-3 py-1 rounded text-white text-sm" style={{ backgroundColor: colors.button }}>
                      Approve
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>Members ({approvedMembers.length})</h2>
          <div className="space-y-2">
            {approvedMembers.map((m) => (
              <div key={m.id} className="bg-white p-3 rounded shadow flex items-center justify-between">
                <div>
                  <span className="font-medium">{m.user.firstName} {m.user.lastName}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-200">{m.role}</span>
                </div>
                {isAdmin && m.userId !== userId && (
                  <div className="flex gap-1">
                    {(["PLAYER", "COACH", "ORGANISER"] as const).map((role) => (
                      <form key={role} action={async () => { "use server"; await updateMemberRole(m.id, role); }}>
                        <button
                          type="submit"
                          disabled={m.role === role}
                          className="px-2 py-1 rounded text-xs text-white disabled:opacity-40"
                          style={{ backgroundColor: colors.button }}
                        >
                          {role}
                        </button>
                      </form>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

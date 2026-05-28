import { auth } from "@/auth";
import { prisma } from "../lib/prisma";
import { colors } from "../colors";
import Link from "next/link";
import { joinClub } from "./actions";

export default async function ClubsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const allClubs = await prisma.club.findMany({
    include: { members: { where: { status: "APPROVED" } } },
    orderBy: { createdAt: "desc" },
  });

  const myClubs = userId
    ? allClubs.filter((c) => c.members.some((m) => m.userId === userId))
    : [];
  const discoverClubs = userId
    ? allClubs.filter((c) => !c.members.some((m) => m.userId === userId))
    : allClubs;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: colors.text }} className="text-3xl font-bold">Clubs</h1>
          {userId && (
            <Link href="/clubs/create">
              <button className="px-4 py-2 rounded text-white" style={{ backgroundColor: colors.button }}>
                Create Club
              </button>
            </Link>
          )}
        </div>

        {userId && myClubs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>My Clubs</h2>
            <div className="space-y-3">
              {myClubs.map((club) => (
                <Link key={club.id} href={`/clubs/${club.id}`}>
                  <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg">{club.name}</h3>
                    <p className="text-sm text-gray-600">{club.location}</p>
                    {club.description && <p className="text-sm mt-1">{club.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">{club.members.length} member{club.members.length !== 1 ? "s" : ""}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>Discover Clubs</h2>
          {discoverClubs.length === 0 ? (
            <p className="text-gray-500">No clubs to discover right now.</p>
          ) : (
            <div className="space-y-3">
              {discoverClubs.map((club) => (
                <div key={club.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{club.name}</h3>
                    <p className="text-sm text-gray-600">{club.location}</p>
                    {club.description && <p className="text-sm mt-1">{club.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">{club.members.length} member{club.members.length !== 1 ? "s" : ""}</p>
                  </div>
                  {userId && (
                    <form action={async () => { "use server"; await joinClub(club.id); }}>
                      <button type="submit" className="px-4 py-2 rounded text-white" style={{ backgroundColor: colors.button }}>
                        Join
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

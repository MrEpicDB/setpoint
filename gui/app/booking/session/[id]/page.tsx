import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { colors } from "../../../colors";
import { getSessionById, updateSession, deleteSession } from "../../actions";

export default async function EditSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authSession = await auth();
  if (!authSession?.user) redirect("/login");

  const session = await getSessionById(id);
  if (!session) notFound();
  if (!session.canEdit) redirect("/booking");

  const toLocalDatetime = (iso: string) => new Date(iso).toISOString().slice(0, 16);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <main className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Edit Session</h1>
        <form action={updateSession} className="bg-white p-6 rounded shadow space-y-4">
          <input type="hidden" name="sessionId" value={id} />
          <div>
            <label className="block text-sm font-medium mb-1">Session Name</label>
            <input name="name" defaultValue={session.name} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input name="location" defaultValue={session.location} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" defaultValue={session.description} required className="w-full border p-2 rounded" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Agenda (optional)</label>
            <textarea name="agenda" defaultValue={session.agenda ?? ""} className="w-full border p-2 rounded" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Skill Level</label>
            <select name="skillLevel" defaultValue={session.skillLevel} className="w-full border p-2 rounded">
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input name="capacity" type="number" min="1" defaultValue={session.capacity} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (pence)</label>
            <input name="price" type="number" min="0" defaultValue={session.price} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input name="startTime" type="datetime-local" defaultValue={toLocalDatetime(session.startTime)} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input name="endTime" type="datetime-local" defaultValue={toLocalDatetime(session.endTime)} required className="w-full border p-2 rounded" />
          </div>
          <button type="submit" className="w-full py-2 rounded text-white" style={{ backgroundColor: colors.button }}>
            Save Changes
          </button>
        </form>

        <form action={async () => { "use server"; await deleteSession(id); }} className="mt-4">
          <button type="submit" className="w-full py-2 rounded text-white bg-red-600">
            Delete Session
          </button>
        </form>
      </main>
    </div>
  );
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { colors } from "../../colors";
import { createClub } from "../actions";

export default async function CreateClubPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
      <form action={createClub} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: colors.text }}>Create Club</h1>
        <input name="name" placeholder="Club Name" required className="w-full border p-2 rounded" />
        <textarea name="description" placeholder="Description (optional)" className="w-full border p-2 rounded" rows={3} />
        <input name="location" placeholder="Location" required className="w-full border p-2 rounded" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="requiresApproval" />
          Require approval for new members
        </label>
        <button type="submit" className="w-full py-2 rounded text-white" style={{ backgroundColor: colors.button }}>
          Create Club
        </button>
      </form>
    </div>
  );
}

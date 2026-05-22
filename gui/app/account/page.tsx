import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { colors } from "../colors";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <main className="flex flex-col items-center mt-20 space-y-4">
        <h1 style={{ color: colors.text }} className="text-4xl font-bold">Account</h1>
        <p className="text-lg">{session.user.name}</p>
        <p className="text-sm text-gray-600">{session.user.email}</p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="px-6 py-2 rounded text-white" style={{ backgroundColor: colors.button }}>
            Sign Out
          </button>
        </form>
      </main>
    </div>
  );
}

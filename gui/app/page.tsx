import Link from 'next/link';
import { colors } from './colors';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <header style={{ backgroundColor: colors.banner }} className="p-4 flex items-center justify-between">
        <div className="flex gap-6">
          <Link href="/" className="text-white">Home</Link>
          <Link href="/booking" className="text-white">Booking</Link>
          <Link href="/club-details" className="text-white">Club Details</Link>
          <Link href="/notifications" className="text-white">Notifications</Link>
          <Link href="/messaging" className="text-white">Messaging</Link>
        </div>
        <Link href="/account">
          <button style={{ backgroundColor: colors.button, color: 'white' }} className="px-6 py-2 rounded">
            Account
          </button>
        </Link>
      </header>
      <main className="flex items-center justify-center mt-20">
        <h1 style={{ color: colors.text }} className="text-6xl font-bold">SetPoint</h1>
      </main>
    </div>
  );
}

import Link from 'next/link';
import { colors } from '../colors';

export default function Header() {
  return (
    <header style={{ backgroundColor: colors.banner }} className="p-4 flex items-center justify-between">
      <div className="flex gap-6">
        <Link href="/" className="text-white">Home</Link>
        <Link href="/booking" className="text-white">Booking</Link>
        <Link href="/clubs" className="text-white">Clubs</Link>
        <Link href="/notifications" className="text-white">Notifications</Link>
        <Link href="/messaging" className="text-white">Messaging</Link>
      </div>
      <Link href="/account">
        <button style={{ backgroundColor: colors.button, color: 'white' }} className="px-6 py-2 rounded">
          Account
        </button>
      </Link>
    </header>
  );
}

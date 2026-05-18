import Link from 'next/link';
import { colors } from '../colors';

export default function Account() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <main className="flex items-center justify-center mt-20">
        <h1 style={{ color: colors.text }} className="text-6xl font-bold">Account</h1>
      </main>
    </div>
  );
}

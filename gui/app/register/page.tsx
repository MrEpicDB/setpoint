"use client";

import { useState } from "react";
import { colors } from "../colors";
import { register } from "../account/actions";

export default function RegisterPage() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const result = await register(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
      <form action={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: colors.text }}>Register</h1>
        {error && <p className="text-red-600">{error}</p>}

        <input name="firstName" placeholder="First Name" required className="w-full border p-2 rounded" />
        <input name="lastName" placeholder="Last Name" required className="w-full border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" required className="w-full border p-2 rounded" />
        <input name="phone" type="tel" placeholder="Phone Number" required className="w-full border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required minLength={8} className="w-full border p-2 rounded" />

        <h2 className="text-lg font-semibold pt-2" style={{ color: colors.text }}>Emergency Contact</h2>
        <input name="emergencyContactName" placeholder="Contact Name" required className="w-full border p-2 rounded" />
        <input name="emergencyContactPhone" type="tel" placeholder="Contact Phone" required className="w-full border p-2 rounded" />
        <input name="emergencyContactRelation" placeholder="Relationship (e.g. Parent, Partner)" required className="w-full border p-2 rounded" />

        <button type="submit" className="w-full py-2 rounded text-white" style={{ backgroundColor: colors.button }}>
          Register
        </button>
        <p className="text-center text-sm">
          Already have an account? <a href="/login" style={{ color: colors.text }}>Sign in</a>
        </p>
      </form>
    </div>
  );
}

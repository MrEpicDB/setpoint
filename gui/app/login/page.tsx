"use client";

import { useState } from "react";
import { colors } from "../colors";
import { login } from "../account/actions";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const result = await login(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
      <form action={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: colors.text }}>Sign In</h1>
        {error && <p className="text-red-600">{error}</p>}
        <input name="email" type="email" placeholder="Email" required className="w-full border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required className="w-full border p-2 rounded" />
        <button type="submit" className="w-full py-2 rounded text-white" style={{ backgroundColor: colors.button }}>
          Sign In
        </button>
        <p className="text-center text-sm">
          No account? <a href="/register" style={{ color: colors.text }}>Register</a>
        </p>
      </form>
    </div>
  );
}

"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signIn } from "@/auth";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const emergencyContactName = formData.get("emergencyContactName") as string;
  const emergencyContactPhone = formData.get("emergencyContactPhone") as string;
  const emergencyContactRelation = formData.get("emergencyContactRelation") as string;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Email already in use" };

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      firstName,
      lastName,
      phone,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
    },
  });

  await signIn("credentials", { email, password, redirectTo: "/" });
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error: any) {
    if (error?.type === "CredentialsSignin") {
      return { error: "Invalid email or password" };
    }
    throw error;
  }
}

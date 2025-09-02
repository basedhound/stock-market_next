"use server";

import { connectToDatabase } from "@/database/mongoose";
import { getAuth } from "../better-auth/auth";
import { headers } from "next/headers";

export const getAllUsersForNewsEmail = async () => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection failed");

    const users = await db
      .collection("user")
      .find(
        { email: { $exists: true, $ne: null } },
        { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
      )
      .toArray();

    return users
      .filter((user) => user.email && user.name)
      .map((user) => ({
        id: user.id || user._id?.toString() || "",
        email: user.email,
        name: user.name,
      }));
  } catch (error) {
    console.error("Error fetching users for news email:", error);
    return [];
  }
};

// Get current user from session
export const getCurrentUser = async () => {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) throw new Error('User not authenticated');
  return session.user;
}

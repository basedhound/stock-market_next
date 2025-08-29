"use server";

import Watchlist from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";

// Get watchlist symbols for a specific user by email
export async function getWatchlistSymbolsByEmail(
  email: string
): Promise<string[]> {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection failed");

    // Find user by email using Better Auth's user collection
    const usersCollection = db.collection("user");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return [];
    }

    const watchlist = await Watchlist.find(
      { userId: user.id },
      "symbol"
    ).lean();

    return watchlist.map((item) => item.symbol);
  } catch (error) {
    console.error(`Error fetching watchlist symbols for ${email}:`, error);
    return [];
  }
}

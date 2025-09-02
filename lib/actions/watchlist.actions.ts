"use server";

import mongoose from "mongoose";
import Watchlist, { WatchlistItem } from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";
import { getCurrentUser } from './user.actions';
import { revalidatePath } from "next/cache";
import { getStocksDetails } from "./finnhub.actions";

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

// Add stock to watchlist
export const addToWatchlist = async (
  symbol: string, 
  company: string,
) => {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    
    // Check if stock already exists in watchlist
    const existingItem = await Watchlist.findOne({
      userId: user.id,
      symbol: symbol.toUpperCase()
    });
    
    if (existingItem) {
      return { success: false, error: 'Stock already in watchlist' };
    }
    
    // Add to watchlist
    const newItem = new Watchlist({
      userId: user.id,
      symbol: symbol.toUpperCase(),
      company: company.trim()
    });
    
    await newItem.save();
    revalidatePath('/watchlist');
    
    return { success: true, message: 'Stock added to watchlist' };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw new Error('Failed to add stock to watchlist');
  }
}

// Remove stock from watchlist
export async function removeFromWatchlist(symbol: string) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();

    // Remove from watchlist
     await Watchlist.deleteOne({
      userId: user.id,
      symbol: symbol.toUpperCase(),
    });
    revalidatePath('/watchlist');

    return { success: true, message: 'Stock removed from watchlist' };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw new Error('Failed to remove stock from watchlist');
  }
}


// Get user's watchlist
export async function getUserWatchlist(): Promise<WatchlistItem[]> {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();

    const watchlist = await Watchlist.find({ userId: user.id })
      .sort({ addedAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(watchlist));
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw new Error('Failed to fetch watchlist');
  }
}

// Get user's watchlist with stock data
export async function getWatchlistWithData(): Promise<StockWithData[]> {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();

    const watchlist = await Watchlist.find({ userId: user.id })
      .sort({ addedAt: -1 })
      .lean();

    if (watchlist.length === 0) return [];

    const stocksWithData = await Promise.all(
      watchlist.map(async (item) => {
        const stockData = await getStocksDetails(item.symbol);

        if (!stockData) {
          console.warn(`Failed to fetch data for ${item.symbol}`);
          return item;
        }

        return {
          company: stockData.company,
          symbol: stockData.symbol,
          currentPrice: stockData.currentPrice,
          priceFormatted: stockData.priceFormatted,
          changeFormatted: stockData.changeFormatted,
          changePercent: stockData.changePercent,
          marketCap: stockData.marketCapFormatted,
          peRatio: stockData.peRatio,
        };
      })
    );

    return JSON.parse(JSON.stringify(stocksWithData));
  } catch (error) {
    console.error('Error loading watchlist:', error);
    throw new Error('Failed to fetch watchlist');
  }
}
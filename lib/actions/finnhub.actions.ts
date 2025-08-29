'use server';

import { cache } from 'react';
import { formatArticle, getTodayString, validateArticle } from '../utils';

const FINNHUB_BASE_URL = process.env.FINNHUB_BASE_URL!;
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY!;

// Fetch function for Finnhub API with optional caching
// 1. fetchJSON(url, 3600) → Cache for 1 hour (for static company data)
// 2. fetchJSON(url) → No caching (for live data)
const fetchJSON = async (url: string, revalidateSeconds?: number) => {
  try {
    const fetchOptions = revalidateSeconds
      ? {
          cache: 'force-cache' as const,
          next: { revalidate: revalidateSeconds },
        }
      : { cache: 'no-store' as const }; // no caching

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

// Fetches watchlist-specific news or falls back to general market news
// 1. No symbols -> Fetch general market news
// 2. With symbols -> Fetch news for each symbol
export const getNews = cache(async (symbols?: string[]) => {
  const today = getTodayString();
  try {
    const cleanSymbols = symbols
      ?.map((symbol) => symbol.trim().toUpperCase())
      .filter((symbol) => symbol.length > 0);

    // Case 1: Fetch company-specific news using round-robin approach
    if (cleanSymbols?.length) {
      const newsFromSymbols: MarketNewsArticle[] = [];

      // Loop up to 6 times, cycling through symbols
      for (let i = 0; i < 6; i++) {
        const symbol = cleanSymbols[i % cleanSymbols.length]; // Round-robin through symbols
        
        const newsData = await fetchJSON(
          `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${today}&to=${today}&token=${FINNHUB_API_KEY}`,
          3600
        );

        if (Array.isArray(newsData) && newsData.length) {
          const validArticles = (newsData as RawNewsArticle[]).filter(
            validateArticle
          );
          // Get one article that we haven't already added
          const articleIndex = Math.floor(i / cleanSymbols.length); // 0,1,2 for each round
          const article = validArticles[articleIndex];
          if (article) {
            newsFromSymbols.push(formatArticle(article, true, symbol));
          }
        }
      }
      // Sort by datetime and return
      return newsFromSymbols.sort((a, b) => b.datetime - a.datetime);
    }

    // Case 2: Fetch general market news (no watchlist)
    const generalNews = await fetchJSON(
      `${FINNHUB_BASE_URL}/news?category=general&from=${today}&to=${today}&token=${FINNHUB_API_KEY}`,
      3600
    );

    return (generalNews as RawNewsArticle[])
      .filter(validateArticle)
      .slice(0, 6)
      .map((article, index) => formatArticle(article, false, undefined, index));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news');
  }
});
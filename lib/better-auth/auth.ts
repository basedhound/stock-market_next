import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { connectToDatabase } from '@/database/mongoose';
import { nextCookies } from 'better-auth/next-js';

// Singleton instance to ensure we only create one auth instance
// This prevents multiple connections and improves performance
let authInstance: ReturnType<typeof betterAuth> | null = null;


export async function getAuth() {
  // Return existing instance if already created (singleton pattern)
  if (authInstance) return authInstance;

  // Establish connection to MongoDB database
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;

  // Ensure database connection is successful before proceeding
  if (!db) {
    throw new Error('Database connection failed: db instance is undefined');
  }

  // Initialize Better Auth with configuration
  authInstance = betterAuth({
    // MongoDB adapter - automatically creates and manages user, session, and account collections
    database: mongodbAdapter(db),
    
    // Secret key for signing JWTs and encrypting session data
    secret: process.env.BETTER_AUTH_SECRET,
    
    // Base URL for auth endpoints (used for redirects and callbacks)
    baseUrl: process.env.BETTER_AUTH_URL,
    
    // Email and password authentication configuration
    emailAndPassword: {
      enabled: true,                    // Enable email/password auth
      disableSignUp: false,            // Allow new user registration
      requireEmailVerification: false, // Skip email verification for now
      minPasswordLength: 8,            // Minimum password security requirement
      maxPasswordLength: 128,          // Prevent extremely long passwords
      autoSignIn: true,               // Automatically sign in user after registration
    },
    
    // Next.js specific plugins for cookie handling
    plugins: [nextCookies()],
    
    // Public base URL for the application
    baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
  });

  return authInstance;
}

// Export the auth instance for use throughout the application
// This handles user authentication, session management, and database operations
export const auth = await getAuth();
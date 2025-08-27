'use server';

import { connectToDatabase } from '@/database/mongoose';

export async function testDbConnection() {
  try {
    await connectToDatabase();

    console.log('Successfully connected to MongoDB!');
    return { success: true, data: 'Connected' };
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    return { success: false, data: 'Not Connected' };
  }
}

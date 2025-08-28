"use server";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";

export const signUpWithEmail = async (data: SignUpFormData) => {
  try {
    // Better Auth API call - handles user creation, password hashing, session creation
    const response = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,  // Better Auth automatically hashes this
        name: data.fullName,
      }
    });
    
    // If user creation successful, trigger Inngest background processing
    if (response) {
      // Send user created event with additional profile data to Inngest
      // This allows async processing of user onboarding without blocking the response
      await inngest.send({
        name: 'app/user.created',
        data: {
          email: data.email,
          name: data.fullName,
          country: data.country,
          investmentGoals: data.investmentGoals,
          riskTolerance: data.riskTolerance,
          preferredIndustry: data.preferredIndustry,
        },
      });
    }
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Sign up failed:', error);
    return { success: false, error: 'Sign up failed. Please try again.' };
  }
};


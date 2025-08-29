import { inngest } from "./client";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getNews } from "../actions/finnhub.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { NO_MARKET_NEWS } from "../constants";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompts";
import { formatDateToday } from "../utils";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    // Construct user profile
    const userProfile = `
    - Country: ${event.data.country}
    - Investment goals: ${event.data.investmentGoals}
    - Risk tolerance: ${event.data.riskTolerance}
    - Preferred industry: ${event.data.preferredIndustry}`;

    // Replace with actual user profile data
    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile
    );

    // Step 1: Call AI model
    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
    });

    // Step 2: Send welcome email with personalized intro
    await step.run("send-welcome-email", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && "text" in part ? part.text : null) ||
        "Thanks for joining Signalist. You now have the tools to track markets, spot opportunities, and make smarter moves — all in one place. Here's what you can do right now:";

      // We will add email sending logic here shortly
      return await sendWelcomeEmail({
        email: event.data.email,
        name: event.data.name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  { id: "daily-news-summary" },
  [{ cron: "5 17 * * *" }, { event: "app/send.daily.news" }],
  async ({ step }) => {
    // Step 1: Get all users for news delivery
    const users = await step.run("get-all-users", getAllUsersForNewsEmail);

    if (!users || users.length === 0) {
      console.log("No users found for news delivery");
      return { success: false, message: "No users found for news delivery" };
    }

    // Step 2: Fetch personalized news for each user
    const userNewsData = await step.run("fetch-user-news", async () =>
      Promise.all(
        users.map(async (user) => {
          try {
            const watchlist = await getWatchlistSymbolsByEmail(user.email);
            const news = await getNews(
              watchlist.length > 0 ? watchlist : undefined
            );
            return { user, news };
          } catch (err) {
            console.error(`Failed to fetch news for ${user.email}:`, err);
            return { user, news: [] };
          }
        })
      )
    );

    // Step 3: Summarize news via AI for each user
    const userNewsSummaries: { user: User; newsContent: string | null }[] = [];
    for (const { user, news } of userNewsData) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{newsData}}",
          JSON.stringify(news, null, 2)
        );

        // Call AI model to summarize news (separate step for each user)
        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({
            model: "gemini-2.5-flash-lite",
          }),
          body: {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent =
          (part && "text" in part ? part.text : null) || NO_MARKET_NEWS;

        userNewsSummaries.push({ user, newsContent });
      } catch (err) {
        console.error(`Failed to summarize news for ${user.email}:`, err);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }

    // Step 4: Send emails
    await step.run("send-news-emails", async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;
          return await sendNewsSummaryEmail({
            email: user.email,
            date: formatDateToday,
            newsContent,
          });
        })
      );
    });

    return {
      success: true,
      message: "Daily news summary emails sent successfully",
    };
  }
);

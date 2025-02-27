import { Models } from "node-appwrite";

export type SubscriptionType =
  | {
      data: Models.Document & {
        checkout_url: string;
        expiresAt: string; // ISO date string
        lemonSqueezySubscriptionId: string;
        paymentStatus: "active" | "pending" | "canceled" | "expired"; // Add other possible statuses if needed
        plan: "free" | "pro" | "enterprise"; // Add other plans if applicable
        userId: string;
      };
    }
  | {
      data: {
        plan: string;
        status: "active" | "pending" | "canceled" | "expired";
      };
    }

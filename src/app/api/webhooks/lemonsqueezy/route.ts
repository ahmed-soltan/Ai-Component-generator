import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASES_ID, PROFILES_ID, SUBSCRIPTIONS_ID } from "@/config";

const SIGNING_SECRET = process.env.LEMONSQUEEZY_SIGNING_SECRET || "ahmed123"; // Replace with your actual secret

export async function POST(req: Request) {
  try {
    const { databases } = await createAdminClient();
    const rawBody = await req.text(); // Get raw request body
    const signature = req.headers.get("x-signature") || "";

    // Verify the webhook signature
    const hash = crypto
      .createHmac("sha256", SIGNING_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== hash) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);
    const meta = payload.meta;

    if (!meta) {
      return NextResponse.json(
        { error: "Missing meta object" },
        { status: 400 }
      );
    }


    console.log("Received Lemon Squeezy webhook:", meta);

    const { userId, planName } = meta.custom_data || {};
    const lemonSqueezySubscriptionId = payload.data.id;
    const subscriptionId = meta.custom_data?.subscriptionId;
    // Handle different event types
    switch (meta.event_name) {
      case "subscription_created": {
        await databases.updateDocument(
          DATABASES_ID,
          SUBSCRIPTIONS_ID,
          subscriptionId,
          {
            lemonSqueezySubscriptionId: lemonSqueezySubscriptionId,
          }
        );
      }
      case "subscription_payment_success": {
        if (!subscriptionId) {
          return NextResponse.json(
            { error: "Missing subscriptionId" },
            { status: 400 }
          );
        }

        await databases.updateDocument(DATABASES_ID, PROFILES_ID, userId, {
          plan: planName,
          subscriptionId,
        });

        await databases.updateDocument(
          DATABASES_ID,
          SUBSCRIPTIONS_ID,
          subscriptionId,
          {
            paymentStatus: "active",
          }
        );

        break;
      }
      case "subscription_cancelled":{
        await databases.updateDocument(DATABASES_ID, PROFILES_ID, userId, {
          plan: "free",
          subscriptionId:null,
        });

        await databases.updateDocument(
          DATABASES_ID,
          SUBSCRIPTIONS_ID,
          subscriptionId,
          {
            paymentStatus: "cancelled",
          }
        );        
      }

      case "subscription_payment_failed":
        console.log("Payment failed event received.");
        break;

      default:
        console.log(`Unhandled event type: ${meta.event_name}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

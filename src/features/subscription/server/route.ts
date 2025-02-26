import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASES_ID,
  PLANS_ID,
  PROFILES_ID,
  SUBSCRIPTIONS_ID,
} from "@/config";

const app = new Hono()
  .post("/checkout/:plan", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { plan } = c.req.param();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await databases.getDocument(
      DATABASES_ID,
      PROFILES_ID,
      user.$id
    );

    if (profile.plan === plan) {
      return c.json({ message: "You Already subscribed to this plan before" });
    }

    if (profile.plan !== plan && profile.plan !== "free") {
      const subscription = await databases.getDocument(
        DATABASES_ID,
        SUBSCRIPTIONS_ID,
        profile.subscriptionId
      );

      if (!subscription) {
        return c.json({ message: "No active subscription found" });
      }

      const lemonSqueezySubscriptionId =
        subscription.lemonSqueezySubscriptionId;

      const response = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions/${lemonSqueezySubscriptionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
            Accept: "application/vnd.api+json",
          },
        }
      );

      const data = await response.json();

      console.log(data);
    }

    // Get plan info by matching plan name
    const plans = await databases.listDocuments(DATABASES_ID, PLANS_ID, [
      Query.equal("name", plan),
    ]);

    if (!plans.documents.length) {
      return c.json({ error: "Plan not found" }, 404);
    }
    const planInfo = plans.documents[0];

    // Determine the correct variant ID based on the plan name
    const variantId =
      plan === "pro"
        ? process.env.LEMON_SQUEEZY_PRO_PLAN_VARIANT_ID
        : process.env.LEMON_SQUEEZY_ENTERPRISE_PLAN_VARIANT_ID;

    if (!variantId) {
      return c.json({ error: "Invalid plan selected" }, 400);
    }

    const subscriptionId = ID.unique();

    // Create the checkout session on Lemon Squeezy
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            product_options: {
              // Use the variant ID as a number if required by product_options;
              // otherwise, adjust accordingly.
              enabled_variants: [Number(variantId)],
            },
            checkout_options: {
              button_color: "#2DD272",
            },
            checkout_data: {
              email: profile.email,
              name: profile.name || "Customer",
              custom: {
                planName: planInfo.name,
                userId: user.$id,
                subscriptionId,
              },
              variant_quantities: [],
            },
            expires_at: "",
            preview: false,
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                // Make sure this is a string (e.g., "154668")
                id: process.env.LEMON_SQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: "variants",
                // Use the default variant id as a string.
                id: variantId,
              },
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!data || !data.data) {
      return c.json({ error: "Failed to create checkout session" }, 500);
    }

    console.log(data);

    await databases.createDocument(
      DATABASES_ID,
      SUBSCRIPTIONS_ID,
      subscriptionId,
      {
        userId: user.$id,
        plan: planInfo.name,
        paymentStatus: "pending",
        checkout_url: data.data.attributes.url,
        // Add expiresAt field: using the checkout response or a default value
        expiresAt: data.data.attributes.expires_at || new Date().toISOString(),
      }
    );
    // Save the checkout URL and subscription details in your database

    return c.json({ checkout_url: data.data.attributes.url });
  })
  .post("/cancel", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await databases.getDocument(
      DATABASES_ID,
      PROFILES_ID,
      user.$id
    );

    const subscription = await databases.getDocument(
      DATABASES_ID,
      SUBSCRIPTIONS_ID,
      profile.subscriptionId
    );

    if (!subscription) {
      return c.json({ message: "No active subscription found" });
    }

    const lemonSqueezySubscriptionId = subscription.lemonSqueezySubscriptionId;

    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${lemonSqueezySubscriptionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
          Accept: "application/vnd.api+json",
        },
      }
    );

    const data = await response.json();

    console.log(data);

    return c.json({ success: true });
  })
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await databases.getDocument(
      DATABASES_ID,
      PROFILES_ID,
      user.$id
    );

    if(profile.plan === "free"){
      return c.json({ data: { plan: "free", status: "active" } });
    }

    const subscription = await databases.getDocument(
      DATABASES_ID,
      SUBSCRIPTIONS_ID,
      profile.subscriptionId
    );

    if (!subscription) {
      return c.json({ message: "No active subscription found" });
    }

    return c.json({ data: subscription });
  });

export default app;

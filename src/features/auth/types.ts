import { Models } from "node-appwrite";

export type ProfileType =
  | (Models.Document & {
      avatar: string | null;
      plan: "free" | "pro" | "enterprise";
      credits: number;
    })
  | null;

export type UserType =
  | (Models.Document & {
      profile: ProfileType;
    })
  | null;

import { cssFrameworks, jsFrameworks, radius, shadow, themes } from "./schema";
import { Models } from "node-appwrite";

export type ComponentType = Models.Document & {
  name: string;
  jsFramework: typeof jsFrameworks;
  cssFramework: typeof cssFrameworks;
  layout?: "flex" | "grid" | undefined;
  radius: typeof radius;
  shadow: typeof shadow;
  prompt: string;
  userId: string;
  theme: keyof typeof themes;
  code: string;
};

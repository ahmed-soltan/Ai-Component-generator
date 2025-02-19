import { Models } from "node-appwrite";

export type ProjectType = Models.Document & {
  name?: string;
  framework?: "react" | "vue" | "angular" | "vanilla";
  description?: string | null;
  userId?: string;
};

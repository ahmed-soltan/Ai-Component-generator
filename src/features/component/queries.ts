import { Query } from "node-appwrite";

import { getCurrent } from "../auth/queries";

import { createSessionClient } from "@/lib/appwrite";
import { DATABASES_ID, PROJECTS_ID } from "@/config";

export const getProjects = async () => {
  const user = await getCurrent();
  const { databases } = await createSessionClient();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const projects = await databases.listDocuments(DATABASES_ID, PROJECTS_ID, [
    Query.equal("userId", user.$id),
  ]);

  if (!projects || projects.total === 0) {
    return { documents: [], total: 0 };
  }

  return projects
};

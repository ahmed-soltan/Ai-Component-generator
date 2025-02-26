"use server";

import { DATABASES_ID, PROFILES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";

export const getCurrent = async () => {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const profile = await databases.getDocument(
      DATABASES_ID,
      PROFILES_ID,
      user.$id
    );

    return {
      ...user,
      profile,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

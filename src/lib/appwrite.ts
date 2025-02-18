import "server-only";

import { cookies } from "next/headers";
import { Client, Account, Users, Databases } from "node-appwrite";

import { AUTH_COOKIE } from "@/features/auth/constants";

export async function createAdminClient() {
  const client = new Client();

  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!);
  client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
  client.setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    },
    get databases(){
      return new Databases(client);
    }
  };
}


export async function createSessionClient() {
  const client = new Client();

  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!);
  client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = cookies().get(AUTH_COOKIE);

  if (!session || !session.value) {
    throw new Error("Unauthorized");
  };

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}

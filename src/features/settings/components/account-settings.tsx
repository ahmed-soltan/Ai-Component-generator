"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCurrent } from "@/features/auth/api/use-current";
import { useUpdateProfile } from "@/features/auth/api/use-update-profile";

export const AccountSettings = () => {
  const { data: user } = useCurrent();
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const { mutate, isPending } = useUpdateProfile();

  useEffect(() => {
    setUsername(user?.profile.name ?? "");
  }, [user]);

  const handleEdit = () => {
    if (username?.trim() === "") {
      setError("Username must be at least 3 characters");
      return;
    }
    mutate(
      { json: { name: username! } },
      {
        onSuccess: () => {
          setError(undefined);
        },
        onError: (error: any) => {
          setError(error.message);
        },
      }
    );
  };

  return (
    <Card className="w-full xl:max-w-[70%] p-5">
      <CardHeader>
        <CardTitle className="text-2xl">Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full flex items-center justify-between gap-5 flex-wrap md:flex-nowrap">
          <h1>username</h1>
          <div className="flex items-center gap-3 w-full max-w-[500px]">
            <Input
              placeholder="username"
              value={username ?? ""}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isPending}
            />
            <Button
              variant={"secondary"}
              disabled={user?.profile.name === username || isPending}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
};

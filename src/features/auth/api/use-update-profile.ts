import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const toastId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ json }: { json: { name: string } }) => {
      toast.loading("updating profile....", { id: toastId });

      const response = await client.api.auth.profile["$patch"]({ json });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      router.refresh();
      toast.success("profile updated Successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError() {
      toast.error("something went wrong", { id: toastId });
    },
  });

  return mutation
};

import { useId } from "react";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";


type ResponseType = InferResponseType<
  (typeof client.api.settings)["update-preferences"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.settings)["update-preferences"]["$patch"]
>;

export const useUpdatePreferences = () => {
  const toastId = useId();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      toast.loading("Updating Preferences....", { id: toastId });

      const response = await client.api.settings["update-preferences"]["$patch"]({
        json,
      });
      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current"] });
      toast.success("Preferences updated successfully!", { id: toastId });
    },
    onError: (error) => {
      toast.error("Error updating preferences: " + error.message, {
        id: toastId,
      });
    },
  });

  return mutation;
};

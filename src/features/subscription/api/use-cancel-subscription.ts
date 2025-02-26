import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCancelSubscription = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.api.subscription["cancel"]["$post"]();
      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      console.log(response);

      return response.json();
    },
    onSuccess: () => {
      toast.success("Subscription canceled");
    },
    onError: () => {
      toast.error("Failed to cancel subscription");
    },
  });

  return mutation;
};

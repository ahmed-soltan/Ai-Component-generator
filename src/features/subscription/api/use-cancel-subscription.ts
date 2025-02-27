import { client } from "@/lib/rpc";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCancelSubscription = () => {
  const queryClient = new QueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.api.subscription["cancel"]["$post"]();
      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Subscription canceled");
      queryClient.invalidateQueries({queryKey:["user"]})
    },
    onError: () => {
      toast.error("Failed to cancel subscription");
    },
  });

  return mutation;
};

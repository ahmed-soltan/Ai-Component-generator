import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetCurrentSubscription = ({userId}:{userId:string}) => {
    
  const query = useQuery({
    queryKey:["current-subscription" , userId],
    queryFn: async () => {
      const response = await client.api.subscription["current"]["$get"]();

      if (!response.ok) {
        const errorData: { error: string } | any = await response.json();
        toast.error(errorData.error);
        throw new Error(errorData.error || "Failed to Get Subscription");
      }

      const responseData = await response.json();
      return responseData;
    },
  });

  return query;
};

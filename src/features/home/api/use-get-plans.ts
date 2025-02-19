import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetPlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await client.api.plans["$get"]();
      if (!response.ok) {
        return null;
      }
      return response.json();
    },
  });
};

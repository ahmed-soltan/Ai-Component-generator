import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetComponents = () => {
  const query = useQuery({
    queryKey: ["components"],
    queryFn: async () => {
      const response = await client.api.component["$get"]();

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};

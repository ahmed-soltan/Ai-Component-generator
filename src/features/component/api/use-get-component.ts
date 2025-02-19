import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetComponent = ({ componentId }: { componentId: string }) => {
  const query = useQuery({
    queryKey: ["project" , componentId],
    queryFn: async () => {
      const response = await client.api.component[":componentId"]["$get"]({
        param: { componentId },
      });

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useCurrentComponent } from "../store/store";

export const useGetComponent = ({ componentId }: { componentId: string }) => {
  const { setCode, setValues } = useCurrentComponent();
  const query = useQuery({
    queryKey: ["component", componentId],
    queryFn: async () => {
      const response = await client.api.component[":componentId"]["$get"]({
        param: { componentId },
      });

      if (!response.ok) {
        return null
      }

      const { data } = await response.json();

      setCode(data.code);
      setValues({
        id: data.$id,
        name: data?.name,
        theme: data?.theme,
        layout: data?.layout,
        jsFramework: data?.jsFramework,
        cssFramework: data?.cssFramework,
        radius: data?.radius,
        shadow: data?.shadow,
        prompt: data?.aiPrompt,
      });

      return data;
    },
  });

  return query;
};

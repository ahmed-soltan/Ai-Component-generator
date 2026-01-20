import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useCurrentComponent } from "../store/store";
import { Code } from "lucide-react";
import { cleanupGeneratedCode } from "@/lib/utils";

export const useGetComponent = ({ componentId }: { componentId: string }) => {
  const { setCode, setValues } = useCurrentComponent();
  const query = useQuery({
    queryKey: ["component", componentId],
    queryFn: async () => {
      const response = await client.api.component[":componentId"]["$get"]({
        param: { componentId },
      });

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      const code = cleanupGeneratedCode(data.code);

      setCode(code);
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

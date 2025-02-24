import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetGenerationAnalytics = () => {
  const query = useQuery({
    queryKey: ["generation"],
    queryFn: async () => {
      const response = await client.api.generation.$get();
      if (!response.ok) {
        return {
          componentName: {},
          jsFramework: {},
          cssFramework: {},
          layout: {},
          theme: {},
          prompt_length: 0,
          createdAt: "",
        };
      }

      const {
        component_name,
        created_at,
        cssFramework,
        jsFramework,
        theme,
        layout,
        prompt_length,
        total
      } = await response.json();

      return {
        componentName: component_name,
        createdAt: created_at,
        jsFramework,
        cssFramework,
        theme,
        layout,
        promptLength: prompt_length,
        totalComponents: total
      };
    },
  });

  return query;
};

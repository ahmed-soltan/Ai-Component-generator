import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetComponentsProps {
  jsFramework?: "react" | "vue" | "angular" | "vanilla";
  cssFramework?: "tailwind" | "bootstrap" | "css";
  theme?: "dark" | "earthy" | "minimalist" | "vibrant" | "pastel";
  search?: string;
}

export const useGetComponents = ({
  jsFramework,
  cssFramework,
  theme,
  search,
}: useGetComponentsProps) => {
  const query = useQuery({
    queryKey: ["components", jsFramework, cssFramework, theme , search],
    queryFn: async () => {
      const response = await client.api.component["$get"]({
        query: {
          jsFramework,
          cssFramework,
          theme,
          search,
        },
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

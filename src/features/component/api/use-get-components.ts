import { client } from "@/lib/rpc";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  const query = useInfiniteQuery({
    queryKey: ["components", jsFramework, cssFramework, theme, search],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api.component["$get"]({
        query: {
          jsFramework,
          cssFramework,
          theme,
          search,
          ...(pageParam ? { cursor: pageParam } : {}), 
          limit: "10",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch components");
      }

      const { data } = await response.json();

      return data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  return query;
};

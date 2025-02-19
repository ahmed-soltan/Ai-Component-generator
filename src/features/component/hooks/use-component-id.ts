import { useParams } from "next/navigation";

export const useComponentId = () => {
  const params = useParams();
  return params.componentId as string;
};

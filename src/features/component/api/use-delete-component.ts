import { InferResponseType, InferRequestType } from "hono";
import { useId } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.component)[":componentId"]["$delete"]
>;

interface UseDeleteComponentProps {
  componentId: string;
}

export const useDeleteComponent = ({
  componentId,
}: UseDeleteComponentProps) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation<ResponseType, Error, any>({
    mutationFn: async () => {
      toast.loading("Deleting Component....", { id: toastId });

      const response = await client.api.component[":componentId"]["$delete"]({
        param: { componentId },
      });
      if (!response.ok) {
        toast.error("Failed to Delete Component", { id: toastId });
        throw new Error("Failed to Delete Component");
      }

      const responseData = await response.json();

      queryClient.invalidateQueries({ queryKey: ["components"] });
      toast.success("Component Deleted Successfully!", { id: toastId });

      return responseData;
    },
  });

  return mutation;
};

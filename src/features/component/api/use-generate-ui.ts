import { useId } from "react";
import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { useComponentStore } from "../store/store";

type ResponseType = InferResponseType<(typeof client.api.component)["generate-ui"]["$post"]>;

export const useGenerateUI = () => {
  const queryClient = useQueryClient();
  const toastId = useId();
  
  const { setCode , setValues , values , code } = useComponentStore();

  const mutation = useMutation<ResponseType, Error, any>({
    mutationFn: async ({json}) => {
      toast.loading("Creating Component....", { id: toastId });

      const response = await client.api.component["generate-ui"]["$post"]({
        json:{
          ...json,
          currentCode:code,
          previousPrompt:values.prompt
        },
      });

      setValues(json)

      if (!response.ok) {
        const errorData: { error: string } | any = await response.json();
        toast.error(errorData.error, { id: toastId });
        throw new Error(errorData.error || "Failed to save Component");
      }

      const responseData = await response.json();
      
      setCode(responseData.component as string); 

      queryClient.invalidateQueries({ queryKey: ["components"] });
      toast.success("Component Created Successfully!", { id: toastId });

      return responseData;
    },
  });

  return mutation;
};

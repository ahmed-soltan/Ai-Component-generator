import { useId } from "react";
import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { useCurrentComponent } from "../store/store";

type ResponseType = InferResponseType<(typeof client.api.component)["generate-ui"]["$post"]>;

export const useUpdateUI= () => {
  const queryClient = useQueryClient();
  const toastId = useId();
  
  const { setCode , setValues , values , code } = useCurrentComponent();

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
        toast.error("Failed to create Component", { id: toastId });
        throw new Error("Failed to create Component");
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

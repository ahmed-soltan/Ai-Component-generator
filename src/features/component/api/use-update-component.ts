import { useId } from "react";
import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { useCurrentComponent } from "../store/store";
import { useComponentId } from "../hooks/use-component-id";

type ResponseType = InferResponseType<
  (typeof client.api.component)["update-component"][":componentId"]["$patch"]
>;

export const useUpdateComponent = () => {
  const toastId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();
  const componentId = useComponentId();

  const { values, code, setCode, setValues } = useCurrentComponent();

  const mutation = useMutation<ResponseType, Error, any>({
    mutationFn: async () => {
      toast.loading("Saving Component....", { id: toastId });

      const requestBody = {
        name: values.name,
        jsFramework: values.jsFramework,
        cssFramework: values.cssFramework,
        layout: values.layout,
        theme: values.theme,
        prompt: values.prompt,
        radius: values.radius,
        shadow: values.shadow,
        code: code,
      };

      const response = await client.api.component["update-component"][
        ":componentId"
      ]["$patch"]({
        json: requestBody,
        param: { componentId },
      });

      if (!response.ok) {
        toast.error("Failed to save Component", { id: toastId });
        throw new Error("Failed to save Component");
      }

      const responseData = await response.json();

      queryClient.invalidateQueries({ queryKey: ["components"] });
      toast.success("Component saved Successfully!", { id: toastId });

      router.push("/dashboard/generated-components");
      setCode("");
      setValues({});

      return responseData;
    },
  });

  return mutation;
};

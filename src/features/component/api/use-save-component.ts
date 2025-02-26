import { useId } from "react";
import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { useComponentStore } from "../store/store";

type ResponseType = InferResponseType<
  (typeof client.api.component)["save-component"]["$post"]
>;

export const useSaveComponent = () => {
  const toastId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { values, code, setCode, setValues } = useComponentStore();

  const mutation = useMutation<ResponseType, Error, any>({
    mutationFn: async () => {
      toast.loading("Saving Component....", { id: toastId });

      const requestBody = {
        name: values.name || "My Component",
        jsFramework: values.jsFramework || "react",
        cssFramework: values.cssFramework || "tailwind",
        layout: values.layout || "flex",
        theme: values.theme || "minimalist",
        prompt: values.prompt || "",
        radius: values.radius || "none",
        shadow: values.shadow || "none",
        code: code || "",
      };

      const response = await client.api.component["save-component"]["$post"]({
        json: requestBody,
      });

      if (!response.ok) {
        const errorData: { error: string } | any = await response.json();
        toast.error(errorData.error, { id: toastId });
        throw new Error(errorData.error || "Failed to save Component");
      }

      const responseData = await response.json();

      queryClient.invalidateQueries({ queryKey: ["components"] });
      toast.success("Component saved Successfully!", { id: toastId });

      router.push("/dashboard/generated-components");
      setCode("");
      setValues({});

      return responseData;
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return mutation;
};

import { useId } from "react";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;

export const useSignUp = () => {
  const toastId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      toast.loading("Creating Account....", { id: toastId });
      const response = await client.api.auth["sign-up"]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      toast.success("Account Created Successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError() {
      toast.error("Email Already Exist!", { id: toastId });
    },
  });
};

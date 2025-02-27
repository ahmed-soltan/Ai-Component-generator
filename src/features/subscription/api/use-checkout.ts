import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";

export const useCheckout = () => {
  const mutation = useMutation({
    mutationFn: async ({ param }: { param: { plan: string } }) => {
      const response = await client.api.subscription["checkout"][":plan"][
        "$post"
      ]({ param });
      if (!response.ok) {
        throw new Error("Failed to checkout");
      }
      const data = (await response.json()) as {
        checkout_url: string;
      };

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Error creating checkout session");
      }
    },
  });

  return mutation;
};

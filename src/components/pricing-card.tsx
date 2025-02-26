import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

import { useCurrent } from "@/features/auth/api/use-current";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/features/subscription/api/use-checkout";
import { cn } from "@/lib/utils";
import { useCancelSubscription } from "@/features/subscription/api/use-cancel-subscription";
import { ConfirmModal } from "./confirm-modal";
import { useState } from "react";

export type PricingCardProps = {
  name: string;
  price: string;
  options: string[];
  description: string;
  currency: "egp" | "usd" | "eur";
  className?: string;
  textHeadlineColor?: string;
  textDescriptionColor?: string;
  currentPlan?: boolean;
};

export const currencySymbolMap = {
  egp: "LE",
  usd: "$",
  eur: "€",
};

export const PricingCard = ({
  name,
  price,
  options,
  currency,
  className = "",
  description,
  textHeadlineColor,
  textDescriptionColor,
  currentPlan,
}: PricingCardProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: user } = useCurrent();
  const { mutate: createCheckout, isPending: isCreatingCheckout } =
    useCheckout();
  const { mutate: cancelSubscription, isPending: isCancellingSubscription } =
    useCancelSubscription();

  const isPending = isCancellingSubscription || isCreatingCheckout;

  const handleCheckout = (): void => {
    if (!user) {
      router.push("/sign-in");
    } else if (user?.profile.plan === name) {
      router.push("/dashboard/generate-component");
    } else if (name === "free") {
      cancelSubscription();
    } else {
      createCheckout({ param: { plan: name } });
    }
  };

  const handleCancelSubscription = () => {
    cancelSubscription();
  };

  return (
    <Card className="w-full max-w-[360px] h-[400px]">
      <ConfirmModal
        title="Are you sure you want to cancel subscription"
        message="This action will cancel your current subscription and you won't be able to access any premium features."
        open={open}
        setOpen={setOpen}
        callbackFn={handleCancelSubscription}
        variant={"destructive"}
      />
      <CardContent className="p-0">
        <div
          className={cn(
            "bg-gradient-to-t from-indigo-100 to-transparent flex flex-col items-start gap-5 p-4 rounded-xl relative",
            className
          )}
        >
          <h1
            className={cn(
              "text-xl font-semibold capitalize text-gray-800",
              textHeadlineColor
            )}
          >
            {name}
          </h1>
          {name === "pro" && !currentPlan && (
            <div className="px-3 py-1 bg-indigo-50 border border-indigo-700 rounded-md text-center w-[100px] absolute top-3 right-3">
              <h1 className="text-indigo-700 text-xs">most popular</h1>
            </div>
          )}
          <p>
            <span
              className={cn(
                "text-3xl text-gray-800 font-semibold",
                textHeadlineColor
              )}
            >
              {price}{" "}
              <span className="uppercase">{currencySymbolMap[currency]}</span>
            </span>{" "}
            / per month
          </p>
          <p className={cn("text-sm text-gray-600", textDescriptionColor)}>
            {description}
          </p>
          {!currentPlan && (
            <Button
              variant={name === "pro" ? "primary" : "default"}
              size={"lg"}
              className="w-full"
              onClick={handleCheckout}
              disabled={isPending}
            >
              Get Started
              <ArrowRight className="ml-1 size-4 group-hover:translate-x-1 duration-150 transition-transform" />
            </Button>
          )}
          {currentPlan && name !== "free" && (
            <Button
              variant={"destructive"}
              size={"lg"}
              className="w-full"
              onClick={() => setOpen(true)}
              disabled={isPending}
            >
              Cancel Subscription
            </Button>
          )}{" "}
          {currentPlan && name === "free" && (
            <Button
              variant={"default"}
              size={"lg"}
              className="w-full"
              disabled={currentPlan}
            >
              Current Plan
            </Button>
          )}
        </div>
        <ul className="p-4 flex flex-col items-start gap-2">
          <span className={cn("text-sm text-gray-600", textDescriptionColor)}>
            everything in business, plus:
          </span>
          {options.map((option, i) => (
            <li className="flex items-center gap-2" key={i}>
              <div className="size-4 flex items-center justify-center rounded-full bg-neutral-100 border">
                <FaCheck className=" text-indigo-400 size-2" />
              </div>
              <span
                className={cn("text-sm text-gray-600", textDescriptionColor)}
              >
                {option}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

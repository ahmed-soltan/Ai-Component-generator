import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

import { useCurrent } from "@/features/auth/api/use-current";
import { useRouter } from "next/navigation";

export type PricingCardProps = {
  name: string;
  price: string;
  options: string[];
  description: string;
  currency: "egp" | "usd" | "eur";
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
  description,
}: PricingCardProps) => {
  const router = useRouter();
  const { data: user } = useCurrent();

  const redirectUser = () => {
    if (!user) {
      router.push("/sign-in");
    } else if (user?.profile.plan === name) {
      router.push("/dashboard/generate-component");
    } else {
      router.push(`/checkout?plan=${name}`);
    }
  };

  return (
    <Card className="max-w-[400px]">
      <CardContent className="p-0">
        <div className="bg-gradient-to-t from-indigo-100 to-transparent flex flex-col items-start gap-5 p-4 rounded-xl relative">
          <h1 className="text-xl text-gray-800 font-semibold capitalize">
            {name}
          </h1>
          {name === "pro" && (
            <div className="px-3 py-1 bg-indigo-50 border border-indigo-700 rounded-md text-center w-[100px] absolute top-3 right-3">
              <h1 className="text-indigo-700 text-xs">most popular</h1>
            </div>
          )}
          <p>
            <span className="text-3xl font-semibold text-gray-800">
              {price}{" "}
              <span className="uppercase">{currencySymbolMap[currency]}</span>
            </span>
            / per month
          </p>
          <p className="text-sm text-gray-600">{description}</p>
          <Button
            variant={name === "pro" ? "primary" : "default"}
            size={"lg"}
            className="w-full"
            onClick={redirectUser}
          >
            Get Started{" "}
            <ArrowRight className="ml-1 size-4 group-hover:translate-x-1 duration-150 transition-transform" />
          </Button>
        </div>
        <ul className="p-4 flex flex-col items-start gap-1">
          <span className="text-sm text-gray-600">
            everything in business, plus:
          </span>
          {options.map((option, i) => (
            <li className="flex items-center gap-1" key={i}>
              <div className="size-4 flex items-center justify-center rounded-full bg-indigo-100 border">
                <FaCheck className=" text-indigo-400 size-2" />
              </div>
              <span className="text-sm text-gray-600">{option}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

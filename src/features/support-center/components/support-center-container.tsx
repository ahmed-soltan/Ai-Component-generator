"use client";

import { Separator } from "@/components/ui/separator";
import { ContainerWrapper } from "@/components/container-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { faqs } from "../data";
import { BsQuestionCircle } from "react-icons/bs";

export const SupportCenterContainer = () => {
  return (
    <ContainerWrapper className="flex items-start flex-col gap-10 sm:max-w-[95%] lg:max-w-[75%]">
      <h1 className="text-3xl sm:text-4xl font-bold"><BsQuestionCircle className="inline mr-4 mb-1"/>Frequently Asked Questions</h1>
      <Separator />
      {faqs.map((faq) => (
        <>
          <h1 className="text-2xl sm:text-3xl font-semibold">{faq.category}</h1>
          <Accordion type="single" collapsible className="w-full">
            {faq.questions.map((question) => (
              <AccordionItem value={question.question}>
                <AccordionTrigger className="text-lg sm:text-xl">
                  {question.question}
                </AccordionTrigger>
                <AccordionContent className="text-md sm:text-lg text-neutral-200">
                  {question.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      ))}
    </ContainerWrapper>
  );
};

"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useContactModal } from "../hooks/use-contact-modal";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const ContactModalContainer = () => {
  const { isOpen, close } = useContactModal();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    if (!message || message?.trim() === "") {
      setError("Message cannot be empty");
      return;
    }
    setError(null);
    setMessage(null);
    close();
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={close}>
      <div className="flex flex-col items-start w-full p-5 gap-5">
        <div className="w-full">
          <h1 className="text-xl font-semibold">Contact us</h1>
          <p className="text-sm text-neutral-400">
            Have questions or need support? We&apos;re here to help! Our
            AI-powered Component Generator is designed to streamline your
            development process by providing high-quality, customizable UI
            components tailored to your needs.
          </p>
        </div>
        <div className="flex flex-col items-center justify-start w-full gap-4">
          <Textarea
            rows={5}
            placeholder="Type Your Message..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            size={"lg"}
            type="button"
            className="w-full"
            onClick={onSubmit}
          >
            Send Message
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm text-left">{error}*</p>}
      </div>
    </ResponsiveModal>
  );
};

import { useId } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useCurrentComponent } from "../store/store";

/**
 * Cleans up AI-generated code by removing markdown code blocks and extra formatting
 */
function cleanupAIOutput(rawCode: string): string {
  if (!rawCode) return "";

  let code = rawCode.trim();

  // Remove opening code blocks with optional language identifier
  code = code.replace(/^```(?:jsx|tsx|javascript|typescript|html|js|ts)?\s*\n?/i, "");

  // Remove closing code blocks
  code = code.replace(/\n?```\s*$/g, "");

  // Remove any remaining triple backticks
  code = code.replace(/```/g, "");

  // Normalize line endings
  code = code.replace(/\r\n/g, "\n");

  return code.trim();
}

/**
 * Stream message types from the server
 */
type StreamMessage =
  | { type: "start" }
  | { type: "chunk"; content: string }
  | { type: "end" }
  | { type: "error"; error: string };

export const useUpdateUI = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const { setCode, setStreamingCode, setIsGenerating, setValues, values, code } = useCurrentComponent();

  const mutation = useMutation<string, Error, any>({
    mutationFn: async ({ json }) => {
      toast.loading("Updating Component....", { id: toastId });

      // Start generation - clear streaming code and set generating flag
      setIsGenerating(true);
      setStreamingCode("");

      const response = await fetch("/api/component/generate-ui", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...json,
          currentCode: code,
          previousPrompt: values.prompt,
        }),
        credentials: "include",
      });

      setValues(json);

      if (!response.ok) {
        let errorMessage = "Failed to Update Component";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Response might not be JSON
        }
        setIsGenerating(false);
        toast.error(errorMessage, { id: toastId });
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setIsGenerating(false);
        toast.error("Failed to read response stream", { id: toastId });
        throw new Error("Failed to read response stream");
      }

      let fullContent = "";
      let buffer = "";

      // Read the stream (newline-delimited JSON)
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const message: StreamMessage = JSON.parse(line);

              switch (message.type) {
                case "start":
                  // Heartbeat received, stream is starting
                  break;
                case "chunk":
                  fullContent += message.content;
                  // Update streaming code in real-time (displayed separately)
                  setStreamingCode(cleanupAIOutput(fullContent));
                  break;
                case "end":
                  // Stream completed successfully
                  break;
                case "error":
                  setIsGenerating(false);
                  toast.error(message.error, { id: toastId });
                  throw new Error(message.error);
              }
            } catch (parseError) {
              // Skip invalid JSON lines
              console.warn("Failed to parse stream message:", line);
            }
          }
        }
      } catch (streamError) {
        setIsGenerating(false);
        throw streamError;
      }

      const cleanedCode = cleanupAIOutput(fullContent);

      // Generation complete - update the stable code and clear generating flag
      setCode(cleanedCode);
      setStreamingCode("");
      setIsGenerating(false);

      queryClient.invalidateQueries({ queryKey: ["components"] });
      toast.success("Component Updated Successfully!", { id: toastId });

      return cleanedCode;
    },
  });

  return mutation;
};

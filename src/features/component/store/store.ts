import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ComponentState {
  code: string;
  streamingCode: string;
  isGenerating: boolean;
  values: Record<string, any>;
  setCode: (code: string) => void;
  setStreamingCode: (code: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setValues: (values: Record<string, any>) => void;
}

export const useComponentStore = create<ComponentState>()(
  persist(
    (set) => ({
      code: "",
      streamingCode: "",
      isGenerating: false,
      values: {},
      setCode: (code) => set({ code }),
      setStreamingCode: (streamingCode) => set({ streamingCode }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setValues: (values) => set({ values }),
    }),
    {
      name: "component-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useCurrentComponent = create<ComponentState>()(
  persist(
    (set) => ({
      code: "",
      streamingCode: "",
      isGenerating: false,
      values: {},
      setCode: (code) => set({ code }),
      setStreamingCode: (streamingCode) => set({ streamingCode }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setValues: (values) => set({ values }),
    }),
    {
      name: "current-component",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

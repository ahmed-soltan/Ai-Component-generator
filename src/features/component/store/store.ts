import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ComponentState {
  code: string;
  values: Record<string, any>;
  setCode: (code: string) => void;
  setValues: (values: Record<string, any>) => void;
}

export const useComponentStore = create<ComponentState>()(
  persist(
    (set) => ({
      code: "",
      values: {},
      setCode: (code) => set({ code }),
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
      values: {},
      setCode: (code) => set({ code }),
      setValues: (values) => set({ values }),
    }),
    {
      name: "current-component",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export const useFilters = () => {
  return useQueryStates({
    jsFramework: parseAsStringEnum(["react", "vue", "angular", "vanilla"]),
    cssFramework: parseAsStringEnum(["tailwind", "bootstrap", "css"]),
    theme: parseAsStringEnum([
      "dark",
      "earthy",
      "minimalist",
      "vibrant",
      "pastel",
    ]),
    search: parseAsString,
  });
};

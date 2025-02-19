import { z } from "zod";

export const jsFrameworks = ["react", "vue" , "angular" , "vanilla"] as const;
export const cssFrameworks = ["tailwind", "bootstrap", "css"] as const;
export const layouts = ["rtl", "ltr"] as const;
export const radius = ["none", "sm", "md", "lg", "xl", "2xl", "full"] as const;
export const shadow = ["none", "sm", "md", "lg", "xl", "2xl", "full"] as const;

export const themes = {
  earthy: {
    primary: "#8D6E63",  // Brown
    secondary: "#A1887F",  // Taupe
    accent: "#4E342E",  // Dark Brown
    background: "#F5F5F5",  // Light Beige
  },
  minimalist: {
    primary: "#212121",  // Dark Gray
    secondary: "#FFFFFF",  // White
    accent: "#BDBDBD",  // Light Gray
    background: "#F5F5F5",  // Light Gray
  },
  vibrant: {
    primary: "#FF4081",  // Pink
    secondary: "#6200EE",  // Purple
    accent: "#00C853",  // Green
    background: "#F1F8E9",  // Light Green
  },
  pastel: {
    primary: "#FFB6C1",  // Light Pink
    secondary: "#A3D8FF",  // Light Blue
    accent: "#FFC0CB",  // Peach
    background: "#F7F7F7",  // Very Light Gray
  },
  dark: {
    primary: "#1A1A1A",  // Charcoal
    secondary: "#2C2C2C",  // Dark Gray
    accent: "#FF9800",  // Orange
    background: "#121212",  // Almost Black
  },
} 

const themeKeys = ["earthy" , "minimalist" , "vibrant" , "pastel" , "dark"] as const

export const createComponentSchema = z.object({
  name: z.string().min(1, {
    message: "Name should be at least 1 character long",
  }),
  jsFramework: z.enum(jsFrameworks).default("react"),
  cssFramework: z.enum(cssFrameworks),
  layout: z.enum(layouts),
  theme: z.enum(themeKeys),  
  prompt: z.string().min(10, {
    message: "Prompt should be at least 10 characters long",
  }),
  radius: z.enum(radius),
  shadow: z.enum(shadow),
  currentCode: z.string().optional(),
  previousPrompt: z.string().optional(),
  code:z.string().optional()
});


export const saveComponentSchema = z.object({
  name: z.string().min(1, {
    message: "Name should be at least 1 character long",
  }),
  jsFramework: z.enum(jsFrameworks).default("react"),
  cssFramework: z.enum(cssFrameworks),
  layout: z.enum(layouts),
  theme: z.enum(themeKeys),  
  prompt: z.string().min(10, {
    message: "Prompt should be at least 10 characters long",
  }),
  radius: z.enum(radius),
  shadow: z.enum(shadow),
  code:z.string().min(20)
});

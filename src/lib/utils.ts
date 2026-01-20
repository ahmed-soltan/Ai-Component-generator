import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function cleanupGeneratedCode(rawCode: string): string {
  if (!rawCode) return "";

  console.log(rawCode);

  let code = rawCode.trim();

  code = code.replace(/^```[a-zA-Z0-9]*\n?/, ""); 
  code = code.replace(/```$/, "");

  code = code.replace(/\r\n/g, "\n");

  return code.trim();
}

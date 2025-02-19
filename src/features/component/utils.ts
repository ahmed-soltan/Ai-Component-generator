import esprima from "esprima";
import escodegen from "escodegen";

export const cleanCode = (code: string) => {
  try {
    const ast = esprima.parseScript(code, { jsx: true });

    let formattedCode = escodegen.generate(ast, {
      format: {
        indent: { style: "  " }, // 2 spaces indentation
        quotes: "single",
        semicolons: false, // No semicolons
      },
    });

    // Ensure there's no "```jsx" or "```" in the final string
    return formattedCode.replace(/```jsx/g, "").trim();
  } catch (error) {
    console.error("Error formatting code:", error);
    return code;
  }
};

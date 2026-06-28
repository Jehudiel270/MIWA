import type { Config } from "tailwindcss";
// @ts-expect-error - daisyui doesn't have type definitions
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    daisyui({
      themes: "all",
    }),
  ],
};

export default config;

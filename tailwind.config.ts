import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#07080a",
        surface: "#0d0d0d",
        "surface-elevated": "#101111",
        "surface-card": "#121212",
        hairline: "#242728",
      },
    },
  },
  plugins: [],
};

export default config;

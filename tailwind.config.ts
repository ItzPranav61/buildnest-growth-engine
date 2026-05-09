import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#243041",
        page: "#F5EFE6",
        panel: "#E8DFCA",
        primary: "#6D94C5",
        primaryDark: "#5E83B2",
        brand: "#5B7FFF",
        brandDark: "#4969D9",
        brandSoft: "#E6EBFF",
        soft: "#CBDCEB",
        line: "#D8CCB8",
        muted: "#64748B",
        danger: "#A64E5B",
        dangerSoft: "#F3D9D6"
      }
    }
  },
  plugins: []
};

export default config;

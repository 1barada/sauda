import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'layout': '240px 1fr'
      },
      gridTemplateRows: {
        'layout': 'minmax(1fr, 100vh) 100px'
      }
    },
  },
  plugins: [],
};
export default config;

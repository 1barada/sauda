import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'main': 'hsl(0deg 0% 97.3%)',
        'main-200': 'hsl(0deg 0% 90%)',
        'main-300': 'hsl(0deg 0% 85%)',
        'border': 'hsl(0deg 0% 87.5%)',
        'border-stronger': 'hsl(0deg 0% 56.1%)',
        'background-selection': 'hsl(0deg 0% 92.9%)'
      },
      gridTemplateColumns: {
        'layout': '240px 1fr',
        'form': '240px 1fr'
      },
      gridTemplateRows: {
        'layout': 'minmax(1fr, 100vh) 100px'
      },
      keyframes: {
        shine: {
          '100%': { 'background-position-x': '-20%' }
        }
      }
    },
  },
  plugins: [],
};
export default config;

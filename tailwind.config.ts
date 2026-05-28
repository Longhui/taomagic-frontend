import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ink': '#1a1a1a',
        'rice': '#f5f0e8',
        'cinnabar': '#c41e3a',
        'bronze': '#4a6741',
        'gold': '#c9a227',
      },
      fontFamily: {
        'serif': ['var(--font-serif)', 'Georgia', 'serif'],
        'sans': ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1', // Indigo per PRD
          foreground: '#FFFFFF',
        },
        background: '#F9FAFB', // soft gray background
        card: '#FFFFFF',
      },
      borderRadius: {
        xl: '12px', // 12px radius per PRD
      }
    },
  },
  plugins: [],
}

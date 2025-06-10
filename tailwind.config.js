/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#6366f1",
        accent: "#a5b4fc",
        background: "#f9fafb",
        surface: "#ffffff",
        muted: "#e5e7eb",
        danger: "#ef4444",
        success: "#10b981",
        warning: "#f59e0b",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }
    },
  },
  plugins: [],
}

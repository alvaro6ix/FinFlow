/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ✅ DORADO ORO (Identidad Principal)
        primary: {
          50: '#fffdf0',
          100: '#fffbc7',
          500: '#FFD700', // Oro Brillante del Login
          600: '#EAB308', // Oro para Hovers
          700: '#CA8A04',
        },
        // ✅ MORADO INDIGO (Identidad de Marca)
        indigo: {
          50: '#f5f3ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Morado del Logo
          700: '#4338ca',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569', 
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617', // Fondo modo oscuro
        },
      },
    },
  },
  plugins: [],
}
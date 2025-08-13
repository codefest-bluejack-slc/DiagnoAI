export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
        'primary': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'title-elegant': ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        'title-modern': ['Space Grotesk', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          elevated: '#334155',
          border: '#475569',
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
            muted: '#94a3b8'
          }
        }
      }
    },
  },
  plugins: [],
}

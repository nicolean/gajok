import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'node-border': '#E5E7EB',
        'node-selected': '#3B82F6',
        'node-selected-bg': '#EFF6FF',
        'edge-default': '#9CA3AF',
        'edge-marriage': '#D1D5DB',
      },
      fontFamily: {
        korean: ["'Noto Sans KR'", 'sans-serif'],
      },
      fontSize: {
        term: ['16px', { lineHeight: '1.4' }],
        romanization: ['11px', { lineHeight: '1.4' }],
        role: ['10px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        node: '8px',
      },
    },
  },
  plugins: [],
} satisfies Config

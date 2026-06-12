/**
 * Design token reference — values live in src/app/globals.css (@theme).
 * Use Tailwind classes: sidebar, brand-700, accent-500, analytics-select, etc.
 */
export const themeColors = {
  sidebar: "#002347",
  sidebarDark: "#001a2e",
  brand: "#002347",
  accent: "#FF5003",
  analytics: {
    heroFrom: "#FF8A52",
    heroVia: "#FF5003",
    heroTo: "#FF6500",
    select: "#f43f5e",
  },
} as const;

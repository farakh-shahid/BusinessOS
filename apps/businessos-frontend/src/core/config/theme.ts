/**
 * Design token reference — values live in src/app/globals.css (@theme).
 */
export const themeColors = {
  inkNavy: "#0E1A36",
  slateInk: "#1C2A4D",
  threadOrange: "#FF6A2B",
  orangeWash: "#FFE9DF",
  canvas: "#F5F7FA",
  cardWhite: "#FFFFFF",
  hairline: "#E4E8F0",
  mutedSlate: "#697A99",
  status: {
    booked: "#3B6FF6",
    cutting: "#F4A828",
    stitching: "#8B5CF6",
    ready: "#12A36A",
    delivered: "#5A6B86",
    urgent: "#E5484D",
  },
  sidebar: "#0E1A36",
  sidebarDark: "#0A1428",
  brand: "#0E1A36",
  accent: "#FF6A2B",
  analytics: {
    heroFrom: "#FF8A52",
    heroVia: "#FF6A2B",
    heroTo: "#FF6500",
    chart: "#FF6A2B",
    chartPeak: "#FF8255",
    select: "#FF6A2B",
  },
} as const;

const avatarPalettes = [
  "bg-violet-500 text-white",
  "bg-sky-500 text-white",
  "bg-emerald-500 text-white",
  "bg-amber-500 text-white",
  "bg-rose-500 text-white",
  "bg-fuchsia-500 text-white",
  "bg-cyan-500 text-white",
  "bg-accent-500 text-white",
  "bg-indigo-500 text-white",
  "bg-teal-500 text-white",
] as const;

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getAvatarPaletteClass(name: string): string {
  const index = hashName(name.trim().toLowerCase()) % avatarPalettes.length;
  return avatarPalettes[index];
}

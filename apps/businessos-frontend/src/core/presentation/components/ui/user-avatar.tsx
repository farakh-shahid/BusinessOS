import { User } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";
import { getAvatarPaletteClass } from "@/core/presentation/lib/avatar-utils";

type UserAvatarSize = "sm" | "md" | "lg";

const sizeClasses: Record<UserAvatarSize, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-12 w-12",
};

const iconSizes: Record<UserAvatarSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-5 w-5",
};

interface UserAvatarProps {
  name: string;
  size?: UserAvatarSize;
  className?: string;
}

export function UserAvatar({ name, size = "md", className }: UserAvatarProps) {
  const palette = getAvatarPaletteClass(name);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full shadow-sm ring-2 ring-white",
        sizeClasses[size],
        palette,
        className,
      )}
      aria-hidden
    >
      <User className={iconSizes[size]} strokeWidth={2} />
    </div>
  );
}

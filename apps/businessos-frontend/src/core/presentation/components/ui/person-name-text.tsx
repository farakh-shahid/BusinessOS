import { cn } from "@/core/presentation/lib/utils";

export function splitPersonName(name: string): { first: string; rest: string } {
  const trimmed = name.trim();
  if (!trimmed) return { first: "", rest: "" };
  const space = trimmed.indexOf(" ");
  if (space === -1) return { first: trimmed, rest: "" };
  return { first: trimmed.slice(0, space), rest: trimmed.slice(space) };
}

interface PersonNameTextProps {
  name: string;
  className?: string;
  firstClassName?: string;
  restClassName?: string;
}

/** First name stays visible; remainder truncates. Full name on hover via title. */
export function PersonNameText({
  name,
  className,
  firstClassName,
  restClassName,
}: PersonNameTextProps) {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const { first, rest } = splitPersonName(trimmed);

  return (
    <span
      className={cn("inline-flex min-w-0 max-w-full items-baseline", className)}
      title={trimmed}
    >
      <span className={cn("shrink-0", firstClassName)}>{first}</span>
      {rest ? (
        <>
          <span aria-hidden> </span>
          <span className={cn("min-w-0 truncate", restClassName)}>{rest.trim()}</span>
        </>
      ) : null}
    </span>
  );
}

export default function Avatar({
  name,
  color,
  size = "md",
}: {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-14 w-14 text-base",
  } as const;

  return (
    <span
      className={`${sizes[size]} inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ring-2 ring-white`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials || "?"}
    </span>
  );
}

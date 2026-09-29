export default function Spinner({
  className = "size-8",
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`animate-spin rounded-full border-2 border-ink/15 border-t-primary ${className}`}
    />
  );
}

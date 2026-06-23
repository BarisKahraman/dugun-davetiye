type MonogramProps = {
  compact?: boolean;
};

export function Monogram({ compact = false }: MonogramProps) {
  return (
    <svg
      className={compact ? "monogram monogram--compact" : "monogram"}
      viewBox="0 0 180 180"
      role="img"
      aria-label="Nuray ve Barış monogramı"
    >
      <path
        className="monogram__line"
        d="M38 130V48l57 82V48M110 49h20c18 0 29 10 29 24 0 13-9 21-23 25 17 3 29 14 29 29 0 16-13 27-34 27h-21V49Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="monogram__accent"
        d="M91 28v124"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

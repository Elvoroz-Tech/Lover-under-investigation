const DEFAULT = [
  "Case open",
  "Do not cross",
  "Romantically suspicious",
  "Evidence collected",
  "Bare minimum detected",
  "Under investigation",
];

/** Infinite marquee "police tape". Content is duplicated so the loop is seamless. */
export default function CautionTape({ items = DEFAULT, alt = false }: { items?: string[]; alt?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className={`tape${alt ? " tape--alt" : ""}`} aria-hidden="true">
      <div className="tape__track">
        {[...row, ...row].map((t, i) => (
          <span className="tape__item" key={i}>
            {t} <span>{alt ? "✦" : "⚠"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

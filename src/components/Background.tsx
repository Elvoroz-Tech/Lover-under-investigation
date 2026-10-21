/** Fixed, GPU-friendly animated backdrop. Pure CSS — zero JS cost. */
const HEARTS = [
  { x: "6%", s: "14px", d: "16s", delay: "0s" },
  { x: "18%", s: "22px", d: "21s", delay: "4s" },
  { x: "33%", s: "12px", d: "14s", delay: "9s" },
  { x: "48%", s: "18px", d: "19s", delay: "2s" },
  { x: "62%", s: "26px", d: "24s", delay: "7s" },
  { x: "75%", s: "13px", d: "15s", delay: "11s" },
  { x: "88%", s: "20px", d: "20s", delay: "5s" },
  { x: "95%", s: "15px", d: "17s", delay: "13s" },
];

export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__blob bg__blob--1" />
      <div className="bg__blob bg__blob--2" />
      <div className="bg__blob bg__blob--3" />
      <div className="bg__grid" />
      <div className="bg__hearts">
        {HEARTS.map((h, i) => (
          <span key={i} style={{ "--x": h.x, "--s": h.s, "--d": h.d, "--delay": h.delay } as React.CSSProperties}>
            {i % 3 === 0 ? "♥" : i % 3 === 1 ? "✦" : "♥"}
          </span>
        ))}
      </div>
      <div className="bg__vignette" />
      <div className="bg__grain" />
    </div>
  );
}

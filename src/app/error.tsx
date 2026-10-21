"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="page container">
      <section className="lost">
        <div>
          <div className="lost__code" style={{ fontSize: "clamp(80px,28vw,180px)" }}>oops</div>
          <h1>The court is in recess. 🫠</h1>
          <p>Something glitched on our side. Your case is safe — it lives in your link, not with us.</p>
          <button className="btn btn--lg" onClick={reset}>Try again</button>
        </div>
      </section>
    </div>
  );
}

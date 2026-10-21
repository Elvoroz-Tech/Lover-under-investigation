export default function PrivacySeal({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`seal${compact ? " seal--compact" : ""}`} role="note">
      <div className="seal__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
      <div>
        <div className="seal__title">Zero-storage by design</div>
        <div className="seal__text">
          Certificates are generated on your device. We keep no database of cases, names or messages — the
          case exists only inside the link you share.
        </div>
      </div>
    </div>
  );
}

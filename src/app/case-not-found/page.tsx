import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";

export const metadata: Metadata = { title: "Case not found", robots: { index: false, follow: false } };

export default function CaseNotFound() {
  return (
    <div className="page container">
      <NotFoundView
        title="Evidence corrupted. 🧾"
        text="This case link is broken or incomplete. Make sure you copied the whole link — or open a new case."
      />
    </div>
  );
}

import type { Metadata } from "next";
import InvestigateClient from "./InvestigateClient";

export const metadata: Metadata = {
  title: "Open a case",
  description: "Pick your partner's crime and get an official-looking roast certificate in seconds. No signup.",
  alternates: { canonical: "/investigate" },
};

export default function InvestigatePage() {
  return (
    <div className="page container">
      <InvestigateClient />
    </div>
  );
}

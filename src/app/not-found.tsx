import NotFoundView from "@/components/NotFoundView";

export default function NotFound() {
  return (
    <div className="page container">
      <NotFoundView
        title="Case dismissed. 🫥"
        text="This file doesn't exist, was tampered with, or the link got cut off while copying. Ask for the full link — or open a case of your own."
      />
    </div>
  );
}

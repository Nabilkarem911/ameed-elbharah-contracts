'use client';

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="rounded bg-brand-navy px-4 py-2 text-white no-print">
      طباعة العقد
    </button>
  );
}

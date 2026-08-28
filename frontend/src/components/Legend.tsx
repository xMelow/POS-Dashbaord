const ITEMS = [
  { label: "POS only", color: "var(--color-pos)" },
  { label: "EagleBe (incl. POS)", color: "var(--color-eagle)" },
  { label: "Neither", color: "var(--color-none)" },
];

export default function Legend() {
  return (
    <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wide text-sub">
      {ITEMS.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full border border-white/10"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
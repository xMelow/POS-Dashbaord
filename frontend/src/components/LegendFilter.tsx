import { CATEGORIES, type CategoryKey } from "../lib/categories";

interface LegendFilterProps {
  visible: Set<CategoryKey>;
  counts: Record<CategoryKey, number>;
  onToggle: (key: CategoryKey) => void;
  onToggleAll: () => void;
  allVisible: boolean;
}

export default function LegendFilter({
  visible,
  counts,
  onToggle,
  onToggleAll,
  allVisible,
}: LegendFilterProps) {
  return (
    <div
      className="shrink-0 rounded-md border border-line bg-bg/90 p-2.5 font-mono text-[13px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="uppercase tracking-wide text-sub">Filter</p>
        <button
          type="button"
          onClick={onToggleAll}
          className="rounded border border-line px-2 py-0.5 text-[11px] uppercase tracking-wide text-sub hover:border-eagle hover:text-ink"
        >
          {allVisible ? "Niets" : "Alles"}
        </button>
      </div>
      <ul className="space-y-0.5 tracking-wide text-sub">
        {CATEGORIES.map((c) => {
          const on = visible.has(c.key);
          return (
            <li key={c.key}>
              <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 select-none hover:bg-line/30 hover:text-ink">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggle(c.key)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border border-line bg-panel text-[11px] leading-none text-bg transition-colors peer-checked:border-eagle peer-checked:bg-eagle peer-focus-visible:ring-1 peer-focus-visible:ring-eagle peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-bg"
                >
                  {on ? "✓" : ""}
                </span>
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/10"
                  style={{ backgroundColor: c.color }}
                />
                <span className="flex-1 whitespace-nowrap">{c.label}</span>
                <span className="tabular-nums text-[11px]">{counts[c.key] ?? 0}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

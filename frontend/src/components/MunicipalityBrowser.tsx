import { useMemo, useRef, useState } from "react";
import { categoryOf, CATEGORY_COLORS, type CategoryKey } from "../lib/categories";
import type { Municipality } from "../types/municipality";

interface MunicipalityBrowserProps {
  municipalities: Municipality[];
  visibleCategories: Set<CategoryKey>;
  selected: Municipality | null;
  onSelect: (municipality: Municipality) => void;
  onHover?: (municipality: Municipality | null) => void;
}

export default function MunicipalityBrowser({
  municipalities,
  visibleCategories,
  selected,
  onSelect,
  onHover,
}: MunicipalityBrowserProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { groups, total } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = municipalities.filter(
      (m) =>
        visibleCategories.has(categoryOf(m)) &&
        (q === "" || m.name.toLowerCase().includes(q)),
    );
    const byProvince = new Map<string, Municipality[]>();
    for (const m of filtered) {
      const province = m.province || "—";
      const list = byProvince.get(province);
      if (list) list.push(m);
      else byProvince.set(province, [m]);
    }
    const groups = [...byProvince.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([province, list]) => ({
        province,
        list: list.sort((a, b) => a.name.localeCompare(b.name)),
      }));
    return { groups, total: filtered.length };
  }, [municipalities, visibleCategories, query]);

  return (
    <div
      className="absolute bottom-6 right-6 top-24 flex w-[18rem] flex-col rounded-md border border-line bg-bg/90 p-2.5 font-mono text-[13px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek gemeente…"
          className="w-full rounded border border-line bg-panel py-1.5 pl-2.5 pr-8 text-ink placeholder:text-sub focus:border-eagle focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            aria-label="Wissen"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-sub hover:text-ink"
          >
            ×
          </button>
        ) : (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 flex w-8 items-center justify-center text-sub"
          >
            ⌕
          </span>
        )}
      </div>

      <p className="mb-2 mt-2.5 uppercase tracking-wide text-sub">Gemeenten ({total})</p>

      <div
        className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-sub"
        onMouseLeave={() => onHover?.(null)}
      >
        {groups.map(({ province, list }) => (
          <div key={province}>
            <p className="sticky top-0 bg-bg/95 py-0.5 text-[11px] uppercase tracking-wide text-eagle">
              {province} ({list.length})
            </p>
            <ul className="space-y-0.5">
              {list.map((m) => {
                const isSelected = selected?.id === m.id;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(m)}
                      onMouseEnter={() => onHover?.(m)}
                      onFocus={() => onHover?.(m)}
                      className={`flex w-full items-center gap-2 rounded px-1 py-1 text-left hover:bg-line/30 hover:text-ink ${
                        isSelected ? "bg-line/50 text-ink" : ""
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 rounded-full border border-white/10"
                        style={{ backgroundColor: CATEGORY_COLORS[categoryOf(m)] }}
                      />
                      <span className="flex-1 truncate">{m.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {total === 0 && <p className="px-1 py-1">Geen gemeenten</p>}
      </div>
    </div>
  );
}

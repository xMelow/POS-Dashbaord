import { useMemo } from "react";
import { categoryOf, CATEGORY_COLORS, type CategoryKey } from "../lib/categories";
import type { Municipality } from "../types/municipality";

interface MunicipalityListProps {
  municipalities: Municipality[];
  visibleCategories: Set<CategoryKey>;
  selected: Municipality | null;
  onSelect: (municipality: Municipality) => void;
}

export default function MunicipalityList({
  municipalities,
  visibleCategories,
  selected,
  onSelect,
}: MunicipalityListProps) {
  const { groups, total } = useMemo(() => {
    const filtered = municipalities.filter((m) => visibleCategories.has(categoryOf(m)));
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
  }, [municipalities, visibleCategories]);

  return (
    <div
      className="flex min-h-0 flex-1 flex-col rounded-md border border-line bg-bg/90 p-2.5 font-mono text-[13px]"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="mb-2 uppercase tracking-wide text-sub">Gemeenten ({total})</p>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-sub">
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

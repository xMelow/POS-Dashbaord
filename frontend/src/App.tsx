import { useMemo, useState } from "react";
import Map from "./components/Map";
import MunicipalitySearch from "./components/MunicipalitySearch";
import GemeentePanel from "./components/GemeentePanel";
import { useMunicipalities } from "./hooks/useMunicipalities";
import type { Municipality } from "./types/municipality";
import { CATEGORIES, categoryOf, type CategoryKey } from "./lib/categories";

function App() {
  const { municipalities, loading, error, replaceMunicipality } = useMunicipalities();
  const [selected, setSelected] = useState<Municipality | null>(null);

  function handleUpdated(updated: Municipality) {
    replaceMunicipality(updated);
    setSelected(updated);
  }

  const [visible, setVisible] = useState<Set<CategoryKey>>(
    () => new Set(CATEGORIES.map((c) => c.key)),
  );
  const allVisible = visible.size === CATEGORIES.length;

  function toggleCategory(key: CategoryKey) {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const counts = useMemo(() => {
    const acc = {} as Record<CategoryKey, number>;
    for (const m of municipalities) {
      const key = categoryOf(m);
      acc[key] = (acc[key] ?? 0) + 1;
    }
    return acc;
  }, [municipalities]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-mono text-sm text-sub">
        Loading municipalities…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center font-mono text-sm text-danger">
        Failed to load: {error}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-panel"
      onClick={() => setSelected(null)}
    >
      <Map
        municipalities={municipalities}
        selected={selected}
        onSelect={setSelected}
        visibleCategories={visible}
      />
      <MunicipalitySearch municipalities={municipalities} onSelect={setSelected} />

      <header className="pointer-events-none absolute inset-x-0 top-0 px-6 pt-6 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Park-O-Sign &amp; EagleBe</h1>
        <div className="pointer-events-auto mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs tracking-wide text-sub">
          {CATEGORIES.map((c) => (
            <label
              key={c.key}
              className="flex cursor-pointer items-center gap-2 select-none hover:text-ink"
            >
              <input
                type="checkbox"
                checked={visible.has(c.key)}
                onChange={() => toggleCategory(c.key)}
                className="h-3 w-3 accent-eagle"
              />
              <span
                className="inline-block h-2.5 w-2.5 rounded-full border border-white/10"
                style={{ backgroundColor: c.color }}
              />
              {c.label} ({counts[c.key] ?? 0})
            </label>
          ))}
          <button
            type="button"
            onClick={() =>
              setVisible(allVisible ? new Set() : new Set(CATEGORIES.map((c) => c.key)))
            }
            className="rounded border border-line px-2 py-0.5 uppercase tracking-wide hover:text-ink"
          >
            {allVisible ? "Niets" : "Alles"}
          </button>
        </div>
      </header>

      <div
        className="absolute left-6 top-60 max-w-[20rem] min-w-[10rem] rounded-md border border-line bg-bg/90 p-3 font-mono text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-2 uppercase tracking-wide text-sub">Gemeente</p>
        {selected ? (
          <GemeentePanel key={selected.id} municipality={selected} onUpdated={handleUpdated} />
        ) : (
          <p className="text-sub">Click a gemeente</p>
        )}
      </div>
    </div>
  );
}

export default App;
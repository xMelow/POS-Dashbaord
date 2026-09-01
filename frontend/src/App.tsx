import { useMemo, useState } from "react";
import Map from "./components/Map";
import MunicipalitySearch from "./components/MunicipalitySearch";
import GemeentePanel from "./components/GemeentePanel";
import LegendFilter from "./components/LegendFilter";
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
      </header>

      <LegendFilter
        visible={visible}
        counts={counts}
        onToggle={toggleCategory}
        onToggleAll={() =>
          setVisible(allVisible ? new Set() : new Set(CATEGORIES.map((c) => c.key)))
        }
        allVisible={allVisible}
      />

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
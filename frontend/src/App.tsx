import { useState } from "react";
import Map from "./components/Map";
import MunicipalitySearch from "./components/MunicipalitySearch";
import GemeentePanel from "./components/GemeentePanel";
import { useMunicipalities } from "./hooks/useMunicipalities";
import type { Municipality } from "./types/municipality";


function App() {
  const { municipalities, loading, error, replaceMunicipality } = useMunicipalities();
  const [selected, setSelected] = useState<Municipality | null>(null);

  function handleUpdated(updated: Municipality) {
    replaceMunicipality(updated);
    setSelected(updated);
  }

  // Statuses that colour the map on their own, overriding the product colour.
  const STATUS_COLORS: Record<string, string> = {
    Prospectie: "var(--color-prospectie)",
    Uitgesteld: "var(--color-uitgesteld)",
    Lopend: "var(--color-lopend)",
    Afgekeurd: "var(--color-afgekeurd)",
  };
  const hasStatusColor = (m: Municipality) => m.status in STATUS_COLORS;

  const prospectie = municipalities.filter((m) => m.status === "Prospectie").length;
  const uitgesteld = municipalities.filter((m) => m.status === "Uitgesteld").length;
  const lopend = municipalities.filter((m) => m.status === "Lopend").length;
  const afgekeurd = municipalities.filter((m) => m.status === "Afgekeurd").length;
  const eagle = municipalities.filter((m) => m.isEagleBeActive && !hasStatusColor(m)).length;
  const posOnly = municipalities.filter(
    (m) => m.isPosCustomer && !m.isEagleBeActive && !hasStatusColor(m),
  ).length;
  const none = municipalities.filter(
    (m) => !m.isPosCustomer && !m.isEagleBeActive && !hasStatusColor(m),
  ).length;

  const stats = [
    { label: "EagleBe", count: eagle, color: "var(--color-eagle)" },
    { label: "Park-O-Sign", count: posOnly, color: "var(--color-pos)" },
    { label: "Prospectie", count: prospectie, color: "var(--color-prospectie)" },
    { label: "Uitgesteld", count: uitgesteld, color: "var(--color-uitgesteld)" },
    { label: "Lopend", count: lopend, color: "var(--color-lopend)" },
    { label: "Afgekeurd", count: afgekeurd, color: "var(--color-afgekeurd)" },
    { label: "Geen", count: none, color: "var(--color-none)" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-mono text-sm text-sub">
        Loading municipalities…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center font-mono text-sm text-pos">
        Failed to load: {error}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-panel"
      onClick={() => setSelected(null)}
    >
      <Map municipalities={municipalities} selected={selected} onSelect={setSelected} />
      <MunicipalitySearch municipalities={municipalities} onSelect={setSelected} />

      <header className="pointer-events-none absolute inset-x-0 top-0 px-6 pt-6 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Park-O-Sign &amp; EagleBe</h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs tracking-wide text-sub">
          {stats.map((s) => (
            <span key={s.label} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full border border-white/10"
                style={{ backgroundColor: s.color }}
              />
              {s.label} ({s.count})
            </span>
          ))}
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
import { useState } from "react";
import Map from "./components/Map";
import { useMunicipalities } from "./hooks/useMunicipalities";
import type { Municipality } from "./api/client";

function App() {
  const { municipalities, loading, error } = useMunicipalities();
  const [selected, setSelected] = useState<Municipality | null>(null);

  const eagle = municipalities.filter((m) => m.isEagleBeActive).length;
  const posOnly = municipalities.filter((m) => m.isPosCustomer && !m.isEagleBeActive).length;
  const none = municipalities.filter((m) => !m.isPosCustomer && !m.isEagleBeActive).length;

  const stats = [
    { label: "EagleBe", count: eagle, color: "var(--color-eagle)" },
    { label: "Park-O-Sign", count: posOnly, color: "var(--color-pos)" },
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
    <div className="fixed inset-0 overflow-hidden bg-panel">
      <Map municipalities={municipalities} onSelect={setSelected} />

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

      <div className="absolute left-6 top-60 max-w-[20rem] min-w-[10rem] rounded-md border border-line bg-bg/90 p-3 font-mono text-sm">
        <p className="mb-2 uppercase tracking-wide text-sub">Gemeente</p>
        {selected ? (
          <dl className="space-y-1">
            <div><dt className="inline text-sub">Naam </dt><dd>{selected.name}</dd></div>
            <div><dt className="inline text-sub">Provincie </dt><dd>{selected.province}</dd></div>
            <div><dt className="inline text-sub">Postcode(s) </dt><dd>{selected.postalCodes}</dd></div>
            <div><dt className="inline text-sub">Setup </dt><dd>{selected.setup}</dd></div>
            <div><dt className="inline text-sub">Status </dt><dd>{selected.status}</dd></div>
          </dl>
        ) : (
          <p className="text-sub">Click a gemeente</p>
        )}
      </div>
    </div>
  );
}

export default App;
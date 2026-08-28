import { useState } from "react";
import Map from "./components/Map";
import Legend from "./components/Legend";
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
    { label: "POS only", count: posOnly, color: "var(--color-pos)" },
    { label: "Neither", count: none, color: "var(--color-none)" },
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
    <div className="flex min-h-screen flex-col">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">POS &amp; EagleBe — per gemeente</h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wide text-sub">
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

      <div className="relative mx-6 mb-6 flex-1 overflow-hidden rounded-lg border border-line bg-panel">
        <Map municipalities={municipalities} onSelect={setSelected} />

        <div className="absolute bottom-4 left-4 rounded-md border border-line bg-bg/90 p-3">
          <Legend />
        </div>

        <div className="absolute top-4 right-4 max-w-[220px] rounded-md border border-line bg-bg/90 p-3 font-mono text-xs">
          <p className="mb-2 uppercase tracking-wide text-sub">Selected</p>
          {selected ? (
            <dl className="space-y-1">
              <div><dt className="inline text-sub">Name </dt><dd className="inline">{selected.name}</dd></div>
              <div><dt className="inline text-sub">Province </dt><dd className="inline">{selected.province}</dd></div>
              <div><dt className="inline text-sub">NIS </dt><dd className="inline">{selected.refnisCode ?? "—"}</dd></div>
              <div><dt className="inline text-sub">Status </dt><dd className="inline">{selected.status}</dd></div>
            </dl>
          ) : (
            <p className="text-sub">Click a gemeente</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
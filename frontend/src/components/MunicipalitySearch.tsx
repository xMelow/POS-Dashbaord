import { useMemo, useRef, useState } from "react";
import type { Municipality } from "../api/client";

interface MunicipalitySearchProps {
  municipalities: Municipality[];
  onSelect: (municipality: Municipality) => void;
}

export default function MunicipalitySearch({ municipalities, onSelect }: MunicipalitySearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return municipalities
      .filter((m) => m.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 8);
  }, [query, municipalities]);

  function choose(municipality: Municipality) {
    onSelect(municipality);
    setQuery(municipality.name);
    setOpen(false);
  }

  function clear() {
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div className="absolute right-6 top-60 w-[18rem] font-mono text-sm">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="Zoek gemeente…"
          className="w-full rounded-md border border-line bg-bg/90 py-2 pl-3 pr-8 text-ink placeholder:text-sub focus:border-eagle focus:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Wissen"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clear}
            className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-sub hover:text-ink"
          >
            ×
          </button>
        )}
      </div>
      {open && matches.length > 0 && (
        <ul className="mt-1 max-h-64 overflow-auto rounded-md border border-line bg-bg/95">
          {matches.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(m)}
                className="block w-full px-3 py-1.5 text-left text-ink hover:bg-line/60"
              >
                {m.name}
                <span className="text-sub"> · {m.province}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && matches.length === 0 && (
        <p className="mt-1 rounded-md border border-line bg-bg/95 px-3 py-1.5 text-sub">Geen resultaten</p>
      )}
    </div>
  );
}

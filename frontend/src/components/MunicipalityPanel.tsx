import { useEffect, useState } from "react";
import { updateMunicipality } from "../api/client";
import type { Municipality } from "../types/municipality";

interface MunicipalityPanelProps {
  municipality: Municipality;
  onUpdated: (municipality: Municipality) => void;
  onClose: () => void;
}

const SETUP_OPTIONS = ["Geen", "Park-O-Sign", "EagleBe"];
const STATUS_OPTIONS = ["", "Prospectie", "Afgekeurd", "Uitgesteld", "Lopend", "Order"];

function withCurrent(options: string[], current: string): string[] {
  return options.includes(current) ? options : [current, ...options];
}

export default function MunicipalityPanel({ municipality, onUpdated, onClose }: MunicipalityPanelProps) {
  const [setup, setSetup] = useState(municipality.setup);
  const [status, setStatus] = useState(municipality.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = setup !== municipality.setup || status !== municipality.status;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateMunicipality(municipality.id, { setup, status });
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  const fieldClass =
    "w-full rounded border border-line bg-panel px-2 py-1 text-ink focus:border-eagle focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[22rem] rounded-lg border border-line bg-bg p-4 font-mono text-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-sub">Gemeente</p>
            <p className="text-lg font-bold tracking-tight text-ink">{municipality.name}</p>
          </div>
          <button
            type="button"
            aria-label="Sluiten"
            onClick={onClose}
            className="-mr-1 -mt-1 flex h-7 w-7 items-center justify-center rounded text-sub hover:bg-line/40 hover:text-ink"
          >
            ×
          </button>
        </div>

        <dl className="space-y-2">
          <div>
            <dt className="inline text-sub">Provincie </dt>
            <dd className="inline">{municipality.province}</dd>
          </div>
          <div>
            <dt className="inline text-sub">Postcode(s) </dt>
            <dd className="inline">{municipality.postalCodes.join(", ")}</dd>
          </div>

          <div>
            <dt className="mb-1 text-sub">Setup</dt>
            <dd>
              <select value={setup} onChange={(e) => setSetup(e.target.value)} className={fieldClass}>
                {withCurrent(SETUP_OPTIONS, setup).map((option) => (
                  <option key={option} value={option}>{option || "—"}</option>
                ))}
              </select>
            </dd>
          </div>

          <div>
            <dt className="mb-1 text-sub">Status</dt>
            <dd>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
                {withCurrent(STATUS_OPTIONS, status).map((option) => (
                  <option key={option} value={option}>{option || "—"}</option>
                ))}
              </select>
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="mt-3 w-full rounded border border-line bg-line/40 px-2 py-1 text-ink hover:bg-line/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Bezig…" : "Opslaan"}
        </button>

        {error && <p className="mt-2 text-danger">{error}</p>}
      </div>
    </div>
  );
}

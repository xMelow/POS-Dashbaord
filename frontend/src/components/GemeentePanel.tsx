import { useState } from "react";
import { updateMunicipality } from "../api/client";
import type { Municipality } from "../types/municipality";

interface GemeentePanelProps {
  municipality: Municipality;
  onUpdated: (municipality: Municipality) => void;
}

const SETUP_OPTIONS = ["Geen", "Park-O-Sign", "EagleBe"];
const STATUS_OPTIONS = ["", "Prospectie", "Afgekeurd", "Uitgesteld", "Lopend", "Order"];

function withCurrent(options: string[], current: string): string[] {
  return options.includes(current) ? options : [current, ...options];
}

export default function GemeentePanel({ municipality, onUpdated }: GemeentePanelProps) {
  const [setup, setSetup] = useState(municipality.setup);
  const [status, setStatus] = useState(municipality.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = setup !== municipality.setup || status !== municipality.status;

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateMunicipality(municipality.id, { setup, status });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  const fieldClass =
    "w-full rounded border border-line bg-panel px-2 py-1 text-ink focus:border-eagle focus:outline-none";

  return (
    <dl className="space-y-2">
      <div><dt className="inline text-sub">Naam </dt><dd className="inline">{municipality.name}</dd></div>
      <div><dt className="inline text-sub">Provincie </dt><dd className="inline">{municipality.province}</dd></div>
      <div><dt className="inline text-sub">Postcode(s) </dt><dd className="inline">{municipality.postalCodes.join(", ")}</dd></div>

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

      <button
        type="button"
        onClick={save}
        disabled={!dirty || saving}
        className="mt-1 w-full rounded border border-line bg-line/40 px-2 py-1 text-ink hover:bg-line/70 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "Bezig…" : "Opslaan"}
      </button>

      {error && <p className="text-pos">{error}</p>}
    </dl>
  );
}

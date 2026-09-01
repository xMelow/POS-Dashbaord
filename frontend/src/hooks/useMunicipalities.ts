import { useCallback, useEffect, useState } from "react";
import { fetchMunicipalities } from "../api/client";
import type { Municipality } from "../types/municipality";

interface UseMunicipalitiesResult {
  municipalities: Municipality[];
  loading: boolean;
  error: string | null;
  replaceMunicipality: (municipality: Municipality) => void;
}

export function useMunicipalities(): UseMunicipalitiesResult {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchMunicipalities()
      .then((data) => {
        if (!cancelled) setMunicipalities(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const replaceMunicipality = useCallback((municipality: Municipality) => {
    setMunicipalities((prev) =>
      prev.map((m) => (m.id === municipality.id ? municipality : m)),
    );
  }, []);

  return { municipalities, loading, error, replaceMunicipality };
}
import { useEffect, useState } from "react";
import { fetchMunicipalities, type Municipality } from "../api/client";

interface UseMunicipalitiesResult {
  municipalities: Municipality[];
  loading: boolean;
  error: string | null;
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

  return { municipalities, loading, error };
}
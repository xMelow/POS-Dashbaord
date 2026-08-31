import type { Municipality, UpdateMunicipalityRequest } from "../types/municipality";

const API_BASE_URL = "http://localhost:5093/api";

export async function fetchMunicipalities(): Promise<Municipality[]> {
  const response = await fetch(`${API_BASE_URL}/municipalities`);
  if (!response.ok) {
    throw new Error(`Failed to fetch municipalities: ${response.status}`);
  }
  return response.json();
}

export async function updateMunicipality(
  id: number,
  body: UpdateMunicipalityRequest,
): Promise<Municipality> {
  const response = await fetch(`${API_BASE_URL}/municipalities/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to update municipality: ${response.status}`);
  }
  return response.json();
}

export interface Municipality {
  id: number;
  refnisCode: string | null;
  region: string;
  province: string;
  name: string;
  postalCodes: number[];
  isPosCustomer: boolean;
  isEagleBeActive: boolean;
  setup: string;
  status: string;
  lastUpdated: string;
}

const API_BASE_URL = "http://localhost:5093/api";

export async function fetchMunicipalities(): Promise<Municipality[]> {
  const response = await fetch(`${API_BASE_URL}/municipalities`);
  if (!response.ok) {
    throw new Error(`Failed to fetch municipalities: ${response.status}`);
  }
  return response.json();
}

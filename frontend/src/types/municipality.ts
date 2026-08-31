
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

export interface UpdateMunicipalityRequest {
  setup: string;
  status: string;
}

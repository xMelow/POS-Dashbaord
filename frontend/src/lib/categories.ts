import type { Municipality } from "../types/municipality";

export type CategoryKey =
  | "eaglePos"
  | "eagle"
  | "pos"
  | "lopendPos"
  | "lopendEagleBe"
  | "lopend"
  | "prospectie"
  | "uitgesteld"
  | "afgekeurd"
  | "none";

export interface Category {
  key: CategoryKey;
  label: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { key: "eaglePos", label: "EagleBe + Park-O-Sign", color: "var(--color-eagle-pos)" },
  { key: "eagle", label: "EagleBe", color: "var(--color-eagle)" },
  { key: "pos", label: "Park-O-Sign", color: "var(--color-pos)" },
  { key: "lopendPos", label: "Lopend (POS)", color: "var(--color-lopend-pos)" },
  { key: "lopendEagleBe", label: "Lopend (EagleBe)", color: "var(--color-lopend-eagle)" },
  { key: "lopend", label: "Lopend", color: "var(--color-lopend)" },
  { key: "prospectie", label: "Prospectie", color: "var(--color-prospectie)" },
  { key: "uitgesteld", label: "Uitgesteld", color: "var(--color-uitgesteld)" },
  { key: "afgekeurd", label: "Afgekeurd", color: "var(--color-afgekeurd)" },
  { key: "none", label: "Geen", color: "var(--color-none)" },
];

export const CATEGORY_COLORS = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.color]),
) as Record<CategoryKey, string>;

export function categoryOf(municipality: Municipality | undefined): CategoryKey {
  if (!municipality) return "none";
  if (municipality.status === "Afgekeurd") return "afgekeurd";
  if (municipality.status === "Prospectie") return "prospectie";
  if (municipality.status === "Uitgesteld") return "uitgesteld";
  if (municipality.status === "Lopend") {
    if (municipality.isPosCustomer) return "lopendPos";
    if (municipality.isEagleBeActive) return "lopendEagleBe";
    return "lopend";
  }
  if (municipality.isEagleBeActive && municipality.isPosCustomer) return "eaglePos";
  if (municipality.isEagleBeActive) return "eagle";
  if (municipality.isPosCustomer) return "pos";
  return "none";
}

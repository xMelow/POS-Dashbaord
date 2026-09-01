import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, createCoordinates } from "@vnedyalk0v/react19-simple-maps";
import belgiumTopology from "../data/belgium.json";
import type { Municipality } from "../types/municipality";
import { categoryOf, CATEGORY_COLORS, type CategoryKey } from "../lib/categories";

function useViewportSize() {
  const [size, setSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

interface MunicipalityFeatureProperties {
  nis: string;
}

interface MapProps {
  municipalities: Municipality[];
  selected: Municipality | null;
  hovered?: Municipality | null;
  onSelect: (municipality: Municipality | null) => void;
  visibleCategories: Set<CategoryKey>;
}

export default function Map({ municipalities, selected, hovered, onSelect, visibleCategories }: MapProps) {
  const { width, height } = useViewportSize();

  const byRefnis: Record<string, Municipality> = Object.fromEntries(
    municipalities.filter((m) => m.refnisCode).map((m) => [m.refnisCode as string, m])
  );

  const selectedNis = selected?.refnisCode ?? null;
  const hoveredNis = hovered?.refnisCode ?? null;

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        center: createCoordinates(4.5, 50.6),
        scale: Math.min(10000, Math.max(width, height) * 12),
      }}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%" }}
    >
      <Geographies geography={belgiumTopology}>
        {({ geographies }) => {
          const rank = (nis: string) =>
            nis === selectedNis ? 2 : nis === hoveredNis ? 1 : 0;
          const ordered =
            selectedNis || hoveredNis
              ? [...geographies].sort(
                  (a, b) =>
                    rank((a.properties as MunicipalityFeatureProperties).nis) -
                    rank((b.properties as MunicipalityFeatureProperties).nis),
                )
              : geographies;

          return ordered.map((geo) => {
            const props = geo.properties as MunicipalityFeatureProperties;
            const municipality = byRefnis[props.nis];
            const isSelected = selectedNis != null && props.nis === selectedNis;
            const isHovered = !isSelected && hoveredNis != null && props.nis === hoveredNis;
            const filteredOut =
              !isSelected && !isHovered && !visibleCategories.has(categoryOf(municipality));
            return (
              <Geography
                key={props.nis}
                geography={geo}
                fill={CATEGORY_COLORS[categoryOf(municipality)]}
                fillOpacity={filteredOut ? 0.05 : 1}
                stroke={isSelected || isHovered ? "#ffffff" : "var(--color-ink)"}
                strokeWidth={isSelected ? 1.75 : isHovered ? 1.25 : 0.25}
                strokeOpacity={filteredOut ? 0.3 : 1}
                onClick={(event) => {
                  event.stopPropagation();
                  if (filteredOut) return;
                  onSelect(municipality ?? null);
                }}
                style={{
                  default: {
                    outline: "none",
                    cursor: filteredOut ? "default" : "pointer",
                    filter: isSelected
                      ? "brightness(1.4) drop-shadow(0 0 3px rgba(255,255,255,0.7))"
                      : isHovered
                        ? "brightness(1.2) drop-shadow(0 0 2px rgba(255,255,255,0.5))"
                        : undefined,
                  },
                  hover: {
                    outline: "none",
                    filter: filteredOut ? undefined : "brightness(0.85)",
                    cursor: filteredOut ? "default" : "pointer",
                  },
                  pressed: { outline: "none" },
                }}
              />
            );
          });
        }}
      </Geographies>
    </ComposableMap>
  );
}
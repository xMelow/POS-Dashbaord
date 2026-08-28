import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, createCoordinates } from "@vnedyalk0v/react19-simple-maps";
import belgiumTopology from "../data/belgium.json";
import type { Municipality } from "../api/client";

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
  onSelect: (municipality: Municipality | null) => void;
}

function colorFor(municipality: Municipality | undefined): string {
  if (!municipality) return "var(--color-none)";
  if (municipality.isEagleBeActive) return "var(--color-eagle)";
  if (municipality.isPosCustomer) return "var(--color-pos)";
  return "var(--color-none)";
}

export default function Map({ municipalities, onSelect }: MapProps) {
  const { width, height } = useViewportSize();

  const byRefnis: Record<string, Municipality> = Object.fromEntries(
    municipalities.filter((m) => m.refnisCode).map((m) => [m.refnisCode as string, m])
  );

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
        {({ geographies }) =>
          geographies.map((geo) => {
            const props = geo.properties as MunicipalityFeatureProperties;
            const municipality = byRefnis[props.nis];
            return (
              <Geography
                key={props.nis}
                geography={geo}
                fill={colorFor(municipality)}
                stroke="var(--color-ink)"
                strokeWidth={0.25}
                onClick={() => onSelect(municipality ?? null)}
                style={{
                  default: { outline: "none", cursor: "pointer" },
                  hover: { outline: "none", filter: "brightness(0.85)", cursor: "pointer" },
                  pressed: { outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
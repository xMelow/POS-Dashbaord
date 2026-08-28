import {
  ComposableMap,
  Geographies,
  Geography,
  createCoordinates,
} from "@vnedyalk0v/react19-simple-maps";
import belgiumTopology from "../data/belgium.json";
import type { Municipality } from "../api/client";

interface MunicipalityFeatureProperties {
  nis: string;
  name_nl: string;
  name_fr: string;
}

interface MapProps {
  municipalities: Municipality[];
}

const COLORS = {
  both: "#a78bfa",
  pos: "#f5a524",
  eagle: "#38bdf8",
  none: "#c9d6e8",
};

function colorFor(municipality: Municipality | undefined): string {
  if (!municipality) return COLORS.none;
  if (municipality.isPosCustomer && municipality.isEagleBeActive) return COLORS.both;
  if (municipality.isPosCustomer) return COLORS.pos;
  if (municipality.isEagleBeActive) return COLORS.eagle;
  return COLORS.none;
}

export default function Map({ municipalities }: MapProps) {
  const byRefnis: Record<string, Municipality> = Object.fromEntries(
    municipalities.filter((m) => m.refnisCode).map((m) => [m.refnisCode as string, m])
  );

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ center: createCoordinates(4.5, 50.6), scale: 8000 }}
      width={640}
      height={520}
      style={{ width: "100%", height: "auto" }}
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
                stroke="#0b1220"
                strokeWidth={0.25}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#475569", outline: "none" },
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
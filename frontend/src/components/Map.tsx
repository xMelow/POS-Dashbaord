import { ComposableMap, Geographies, Geography, createCoordinates } from "@vnedyalk0v/react19-simple-maps";
import belgiumTopology from "../data/belgium.json"

interface MunicipalityProperties {
  nis: string;
  name_nl: string;
  name_fr: string;
  arr_nis: string;
  reg_nl: string;
  population: number;
}

export default function Map() {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        center: createCoordinates(4.5, 50.6),
        scale: 7000,
      }}
      width={540}
      height={450}
    >
      <Geographies geography={belgiumTopology}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const props = geo.properties as MunicipalityProperties;
            return (
              <Geography
                key={props.nis}
                geography={geo}
                fill="#a9cdff"
                stroke="#0b1220"
                strokeWidth={0.25}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#2c71e7", outline: "none" },
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

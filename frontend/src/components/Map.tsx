import {
  ComposableMap,
  Geographies,
  Geography,
  createCoordinates,
} from "@vnedyalk0v/react19-simple-maps";
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
        scale: 8000,
      }}
      width={640}
      height={520}
    >
      <Geographies geography={belgiumTopology}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const props = geo.properties as MunicipalityProperties;
            return (
              <Geography
                key={props.nis}
                geography={geo}
                fill="#c9d6e8"
                stroke="#0b1220"
                strokeWidth={0.25}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#8fa2c2", outline: "none" },
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
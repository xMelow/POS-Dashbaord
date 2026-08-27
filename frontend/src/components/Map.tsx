import {
  ComposableMap,
  Geographies,
  Geography,
  createCoordinates,
} from "@vnedyalk0v/react19-simple-maps";

interface NutsProperties {
  NUTS_ID: string;
  CNTR_CODE: string;
  NAME_LATN: string;
}

const GEO_URL =
  "https://r2.datahub.io/clt98mkvt000ql70811z8xj6l/main/raw/data/NUTS_RG_60M_2024_4326_LEVL_2.geojson";

export default function Map() {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        center: createCoordinates(4.5, 50.6),
        scale: 5000,
      }}
      width={640}
      height={520}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies
            .filter((geo) => (geo.properties as NutsProperties).CNTR_CODE === "BE")
            .map((geo) => {
              const props = geo.properties as NutsProperties;
              return (
                <Geography
                  key={props.NUTS_ID}
                  geography={geo}
                  fill="#c9d6e8"
                  stroke="#0b1220"
                  strokeWidth={0.75}
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
import Map from "./components/Map";
import { useMunicipalities } from "./hooks/useMunicipalities";

export default function App() {
  const { municipalities, loading, error } = useMunicipalities();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Map municipalities={municipalities} />
    </div>
  );
}

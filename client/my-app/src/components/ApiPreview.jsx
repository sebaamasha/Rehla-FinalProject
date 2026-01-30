import { useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";
import TripCard from "./TripCard";

const API_BASE = process.env.REACT_APP_API_BASE;

function ApiPreview() {
  useSelector((s) => s.favorites.items); // إذا بدك تضل مربوط بالـ store بدون ما تستعمليه

  const { data, loading, error } = useFetch(`${API_BASE}/api/destinations/preview`);

  const destinations = Array.isArray(data) ? data : [];

  if (loading) return <p className="state-text">Loading destinations...</p>;
  if (error) return <p className="state-text error">{error}</p>;
  if (destinations.length === 0) return null;

  return (
    <section className="api-preview">
      <div className="section-header">
        <h2>Explore Destinations</h2>
        <p className="muted">Discover amazing places around the world</p>
      </div>
      <div className="stories-grid">
        {destinations.map((dest) => (
          <TripCard
            key={dest._id}
            trip={{
              id: dest._id,
              title: dest.title,
              location: dest.location,
              description: dest.description,
              imageUrl: dest.imageUrl,
            }}
            showFavorite={true}
            showDelete={false}
            showEdit={false}
          />
        ))}
      </div>
    </section>
  );
}

export default ApiPreview;

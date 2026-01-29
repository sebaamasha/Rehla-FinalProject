import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/favoritesSlice";
import useFetch from "../hooks/useFetch";
import TripCard from "./TripCard";

const API_BASE = "http://localhost:5000";

function ApiPreview() {
  const dispatch = useDispatch();
  const favorites = useSelector((s) => s.favorites.items);

  const { data, loading, error } = useFetch(`${API_BASE}/api/destinations/preview`);

  const destinations = Array.isArray(data) ? data : [];

  function isFav(id) {
    return favorites.some((f) => f.id === id);
  }

  function toggleFav(dest) {
    const item = {
      id: dest._id,
      title: dest.title,
      location: dest.location,
      description: dest.description,
      imageUrl: dest.imageUrl,
    };
    if (isFav(dest._id)) dispatch(removeFavorite(dest._id));
    else dispatch(addFavorite(item));
  }

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

import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/favoritesSlice";
import useFetch from "../hooks/useFetch";

const API_BASE = process.env.REACT_APP_API_BASE;

function ApiPage() {
  const dispatch = useDispatch();
  const favorites = useSelector((s) => s.favorites.items);

  const { data, loading, error, refetch } = useFetch(`${API_BASE}/api/destinations`);

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

  return (
    <div className="api-page">
      <div className="section-header">
        <h1>Explore Destinations</h1>
        <p className="muted">Discover amazing places around the world</p>
      </div>

      {loading && <p className="state-text">Loading destinations...</p>}

      {error && (
        <div className="state-box state-error">
          <p>{error}</p>
          <button className="btn btn-ghost" onClick={refetch}>Try again</button>
        </div>
      )}

      {!loading && !error && destinations.length === 0 && (
        <div className="state-box">
          <p>No destinations found.</p>
        </div>
      )}

      {!loading && !error && destinations.length > 0 && (
        <div className="stories-grid">
          {destinations.map((dest) => (
            <article key={dest._id} className="trip-card">
              <div className="trip-img-wrap">
                <span className="region-badge">{dest.region}</span>
                <img
                  className="trip-img"
                  src={dest.imageUrl}
                  alt={dest.title}
                  loading="lazy"
                />
              </div>
              <div className="trip-body">
                <div className="trip-head">
                  <h3 className="trip-title">{dest.title}</h3>
                  <p className="trip-location">{dest.location}</p>
                </div>
                <p className="trip-description">{dest.description}</p>
                <div className="trip-actions">
                  <button
                    className="btn btn-ghost"
                    onClick={() => toggleFav(dest)}
                  >
                    {isFav(dest._id) ? "★ Saved" : "☆ Save"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApiPage;

import { useDispatch, useSelector } from "react-redux";
import { clearFavorites } from "../redux/favoritesSlice";
import TripCard from "../components/TripCard";

function FavoritesPage() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  return (
    <div className="favorites-page">
      <div className="section-header">
        <h1>My Favorites</h1>
        <p className="muted">Saved stories from Home and Explore pages</p>
      </div>

      {favorites.length === 0 && (
        <div className="state-box">
          <p>No favorites yet. Start exploring and save stories you like! ⭐</p>
        </div>
      )}

      {favorites.length > 0 && (
        <>
          <button
            onClick={() => dispatch(clearFavorites())}
            className="btn btn-danger"
            style={{ marginBottom: "1.5rem" }}
          >
            Clear All Favorites
          </button>

          <div className="stories-grid">
            {favorites.map((item) => (
              <TripCard
                key={item.id}
                trip={item}
                showFavorite={true}
                showDelete={false}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FavoritesPage;

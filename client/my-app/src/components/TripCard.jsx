import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addFavorite, removeFavorite } from "../redux/favoritesSlice";
import "./TripCard.css";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60";

function TripCard({
  trip,
  showFavorite = true,
  showDelete = false,
  showEdit = false,
  deleting = false,
  onDelete,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const favorites = useSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === trip.id);

  function handleFavoriteClick() {
    if (isFavorite) dispatch(removeFavorite(trip.id));
    else dispatch(addFavorite(trip));
  }

  function handleEdit() {
    navigate(`/edit-story/${trip.id}`);
  }

  const imgSrc = trip.imageUrl
    ? trip.imageUrl.startsWith("http")
      ? trip.imageUrl
      : `http://localhost:5000${trip.imageUrl}`
    : FALLBACK_IMG;

  return (
    <article className="trip-card">
      <div className="trip-img-wrap">
        <img className="trip-img" src={imgSrc} alt={trip.title} loading="lazy" />
      </div>

      <div className="trip-body">
        <div className="trip-head">
          <h3 className="trip-title">{trip.title}</h3>
          <p className="trip-location">{trip.location}</p>
        </div>

        <p className="trip-description">{trip.description}</p>

        <div className="trip-actions">
          {showFavorite && (
            <button className="btn btn-ghost" onClick={handleFavoriteClick}>
              {isFavorite ? "★ Saved" : "☆ Save"}
            </button>
          )}

          {showEdit && (
            <button className="btn btn-ghost" onClick={handleEdit}>
              ✏️ Edit
            </button>
          )}

          {showDelete && (
            <button className="btn btn-danger" onClick={onDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default TripCard;

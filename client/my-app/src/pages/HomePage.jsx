import { useState } from "react";
import "./HomePage.css";
import TripCard from "../components/TripCard";
import ApiPreview from "../components/ApiPreview";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE;

function HomePage() {
  const { data, loading, error, refetch } = useFetch(`${API_BASE}/api/stories`);
  const { token } = useAuth();
  const [deletingId, setDeletingId] = useState("");

  async function handleDelete(id) {
    const ok = window.confirm("Delete this story?");
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/stories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Failed to delete story");
      refetch();
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingId("");
    }
  }

  const stories = Array.isArray(data) ? data : [];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay">
          <h1>Experience travel through stories</h1>
          <p>Read real travel experiences and get inspired for your next trip.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={refetch}>
              Refresh stories
            </button>
          </div>
        </div>
      </section>

      <section className="stories-section">
        <div className="section-header">
          <h2>Stories</h2>
        </div>

        {loading && <p className="state-text">Loading stories...</p>}

        {error && (
          <div className="state-box state-error">
            <p>{error}</p>
            <button className="btn btn-ghost" onClick={refetch}>Try again</button>
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div className="state-box">
            <p>No stories yet. Add one from the "Add Story" page.</p>
          </div>
        )}

        {!loading && !error && stories.length > 0 && (
          <div className="stories-grid">
            {stories.map((story) => (
              <TripCard
                key={story._id}
                trip={{
                  id: story._id,
                  title: story.title,
                  location: story.location,
                  description: story.description,
                  imageUrl: story.imageUrl,
                  authorName: story.author?.name,
                }}
                showFavorite={true}
                showEdit={story.isOwner}
                showDelete={story.isOwner}
                deleting={deletingId === story._id}
                onDelete={() => handleDelete(story._id)}
              />
            ))}
          </div>
        )}

        <ApiPreview />
      </section>
    </div>
  );
}

export default HomePage;

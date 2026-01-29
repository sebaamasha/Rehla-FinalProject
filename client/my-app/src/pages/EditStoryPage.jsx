import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FormPage.css";

const API_BASE = process.env.REACT_APP_API_BASE;

function EditStoryPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch existing story data
    useEffect(() => {
        async function fetchStory() {
            try {
                const res = await fetch(`${API_BASE}/api/stories`);
                const stories = await res.json();
                const story = stories.find((s) => s._id === id);

                if (story) {
                    setTitle(story.title);
                    setLocation(story.location);
                    setDescription(story.description);
                    setCurrentImageUrl(story.imageUrl);
                } else {
                    setServerError("Story not found");
                }
            } catch (err) {
                setServerError("Failed to load story");
            } finally {
                setLoading(false);
            }
        }
        fetchStory();
    }, [id]);

    // Preview for new image
    useEffect(() => {
        if (!imageFile) {
            setPreviewUrl("");
            return;
        }
        const url = URL.createObjectURL(imageFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    function validateForm() {
        const newErrors = {};
        if (title.trim().length < 3) newErrors.title = "Title must be at least 3 characters.";
        if (location.trim().length === 0) newErrors.location = "Location is required.";
        if (description.trim().length < 10) newErrors.description = "Description must be at least 10 characters.";

        if (imageFile) {
            if (!imageFile.type.startsWith("image/")) newErrors.image = "Please upload an image file.";
            const maxSize = 2 * 1024 * 1024;
            if (imageFile.size > maxSize) newErrors.image = "Image must be 2MB or less.";
        }

        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSuccessMessage("");
        setServerError("");

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("location", location.trim());
            formData.append("description", description.trim());
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const token = localStorage.getItem("rehla_token");
            const res = await fetch(`${API_BASE}/api/stories/${id}`, {
                method: "PUT",
                body: formData,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.message || "Failed to update story");
            }

            setSuccessMessage("Story updated successfully!");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            setServerError(err.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="form-page">
                <div className="form-container">
                    <p>Loading story...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="form-page">
            <div className="form-container">
                <h1 className="form-title">Edit Story</h1>
                <p className="form-subtitle">Update your travel experience</p>

                <form onSubmit={handleSubmit} className="story-form">
                    <div className="form-field">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Trip Title"
                        />
                        {errors.title && <p className="error-message">{errors.title}</p>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="location">Location</label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location (e.g., Paris)"
                        />
                        {errors.location && <p className="error-message">{errors.location}</p>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="image">Trip Photo (optional - leave empty to keep current)</label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                        {errors.image && <p className="error-message">{errors.image}</p>}

                        {/* Show preview of new image or current image */}
                        {(previewUrl || currentImageUrl) && (
                            <img
                                src={previewUrl || `${API_BASE}${currentImageUrl}`}
                                alt="Preview"
                                style={{
                                    marginTop: 10,
                                    width: "100%",
                                    maxHeight: 230,
                                    objectFit: "cover",
                                    borderRadius: 12,
                                    border: "1px solid var(--border)",
                                }}
                            />
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell us about your experience..."
                        />
                        {errors.description && <p className="error-message">{errors.description}</p>}
                    </div>

                    {serverError && <p className="error-message">{serverError}</p>}

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate("/")}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                            style={{ flex: 2 }}
                        >
                            {isSubmitting ? "Updating..." : "Update Story"}
                        </button>
                    </div>

                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>
            </div>
        </div>
    );
}

export default EditStoryPage;

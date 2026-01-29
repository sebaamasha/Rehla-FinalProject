import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./FormPage.css";

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Validation
        if (!name || name.trim().length < 2) {
            setError("Name must be at least 2 characters");
            return;
        }
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setError("Please enter a valid email");
            return;
        }
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await register(name.trim(), email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-page">
            <div className="form-container">
                <h1 className="form-title">Create Account</h1>
                <p className="form-subtitle">Join Rehla and share your travel stories</p>

                <form onSubmit={handleSubmit} className="story-form">
                    <div className="form-field">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Creating account..." : "Register"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--text-muted)" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./FormPage.css";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Validation
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
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
                <h1 className="form-title">Welcome Back</h1>
                <p className="form-subtitle">Login to your Rehla account</p>

                <form onSubmit={handleSubmit} className="story-form">
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
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--text-muted)" }}>
                        Don't have an account?{" "}
                        <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;

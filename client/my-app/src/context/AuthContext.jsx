import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = "http://localhost:5000";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("rehla_token"));
    const [loading, setLoading] = useState(true);

    // Check token on mount
    useEffect(() => {
        async function checkAuth() {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    // Token invalid, clear it
                    localStorage.removeItem("rehla_token");
                    setToken(null);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [token]);

    // Login function
    async function login(email, password) {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("rehla_token", data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    }

    // Register function
    async function register(name, email, password) {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Registration failed");
        }

        localStorage.setItem("rehla_token", data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    }

    // Logout function
    function logout() {
        localStorage.removeItem("rehla_token");
        setToken(null);
        setUser(null);
    }

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

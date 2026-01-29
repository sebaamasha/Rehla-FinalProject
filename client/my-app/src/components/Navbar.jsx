import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { FaSun, FaMoon } from "react-icons/fa";
import "./Navbar.css";

function Navbar({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const favoritesCount = useSelector((state) => state.favorites.items.length);
  const { user, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="main-header">
      <Link to="/" className="logo">
        <img src="/logo.png" alt="Rehla" className="logo-img" />
      </Link>

      <nav className="main-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        {isAuthenticated && (
          <NavLink to="/add-story" className={({ isActive }) => (isActive ? "active" : "")}>
            Add Story
          </NavLink>
        )}
        <NavLink to="/explore" className={({ isActive }) => (isActive ? "active" : "")}>
          Explore
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => (isActive ? "active" : "")}>
          Favorites <span className="badge">{favoritesCount}</span>
        </NavLink>
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span className="user-name">Hi, {user?.name}</span>
            <button onClick={handleLogout} className="btn btn-ghost">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-ghost">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-primary">
              Register
            </NavLink>
          </>
        )}

        <button
          onClick={onToggleTheme}
          className="theme-btn"
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;

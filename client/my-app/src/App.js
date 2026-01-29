import { Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";
import EditStoryPage from "./pages/EditStoryPage";
import ApiPage from "./pages/ApiPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import useLocalStorage from "./hooks/useLocalStorage";
import Navbar from "./components/Navbar";

function App() {
  const [theme, setTheme] = useLocalStorage("rehla_theme", "light");

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <AuthProvider>
      <div className={`app ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-story" element={<FormPage />} />
            <Route path="/edit-story/:id" element={<EditStoryPage />} />
            <Route path="/explore" element={<ApiPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;

import { createSlice } from "@reduxjs/toolkit";

// Load favorites from localStorage
function loadFromStorage() {
  try {
    const saved = localStorage.getItem("rehla_favorites");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error("Failed to load favorites from localStorage:", err);
  }
  return [];
}

// Save favorites to localStorage
function saveToStorage(items) {
  try {
    localStorage.setItem("rehla_favorites", JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save favorites to localStorage:", err);
  }
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: loadFromStorage(),
    lastUpdated: null,
  },
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.items.find((x) => x.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        saveToStorage(state.items);
      }
      state.lastUpdated = Date.now();
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter((x) => x.id !== action.payload);
      saveToStorage(state.items);
      state.lastUpdated = Date.now();
    },
    clearFavorites: (state) => {
      state.items = [];
      saveToStorage(state.items);
      state.lastUpdated = Date.now();
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

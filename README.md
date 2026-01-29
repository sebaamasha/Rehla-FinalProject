Rehla – Travel Stories App

Rehla is a React project that allows users to explore travel stories, submit their own travel experiences.

## How to Run
1. **Server:**
   - Go to `server` folder: `cd server`
   - Install: `npm install`
   - Create `.env` file based on `.env.example`.
   - Start: `npm run dev`

2. **Client:**
   - Go to `client/my-app` folder: `cd client/my-app`
   - Install: `npm install`
   - Start: `npm start`

## Homework 3 Features

Custom Hook (useLocalStorage): used to persist the theme (light/dark) in localStorage.

Custom Hook (useFetch): used for API calls (data, loading, error, refetch). Used in both the API page and Home page preview.

Redux Toolkit: used for global favorites state (add/remove/clear). Favorites are shared across pages and shown in the navbar.
# Rehla – Travel Stories Platform (Final Project)

Rehla is a application that allows users to explore travel stories, create and edit their own experiences, upload images, and save favorite trips.

## Features

- Browse travel stories  
- Create new story with image upload  
- Edit existing stories  
- User authentication  
- Save and manage favorite stories  
- API page for fetching stories  
- Custom hooks 

## How to Run

### Server
- Go to `server` folder: `cd server`
- Install: `npm install`
- Create `.env` file based on `.env.example`
- Start: `npm run dev`

### Client
- Go to `client/my-app` folder: `cd client/my-app`
- Install: `npm install`
- Start: `npm start`

---

## Environment Variables

Inside `server/.env`:

```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    ```

---

## Database Connection

    The project uses MongoDB.

    Create a MongoDB database (local or Atlas) and place the connection string inside:

    ```
    MONGO_URI=your_mongodb_connection_string
    ```

    The server connects automatically on startup.


Live Demo

    Frontend:
    https://rehla-frontend.netlify.app/

    Backend API:
    https://rehla-finalproject.onrender.com
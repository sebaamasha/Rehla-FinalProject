import express from "express";
import Destination from "../models/Destination.js";

const router = express.Router();

// Seed data - will be inserted if DB is empty
const seedDestinations = [
    {
        title: "Santorini",
        location: "Greece",
        description: "Famous for its stunning sunsets, white-washed buildings, and crystal-clear waters of the Aegean Sea.",
        imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1200&q=80",
        region: "Europe"
    },
    {
        title: "Bali",
        location: "Indonesia",
        description: "A tropical paradise known for its lush rice terraces, ancient temples, and vibrant culture.",
        imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        region: "Asia"
    },
    {
        title: "Machu Picchu",
        location: "Peru",
        description: "The iconic Incan citadel set high in the Andes Mountains, a UNESCO World Heritage site.",
        imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1200&q=80",
        region: "South America"
    },
    {
        title: "Maldives",
        location: "Maldives",
        description: "Crystal clear waters, overwater bungalows, and some of the world's best diving spots.",
        imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
        region: "Asia"
    },
    {
        title: "Paris",
        location: "France",
        description: "The City of Light, home to the Eiffel Tower, world-class museums, and romantic streets.",
        imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        region: "Europe"
    },
    {
        title: "Tokyo",
        location: "Japan",
        description: "A fascinating blend of ancient temples and ultra-modern technology in one vibrant city.",
        imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
        region: "Asia"
    },
    {
        title: "New York City",
        location: "USA",
        description: "The city that never sleeps - iconic skyline, Broadway shows, and endless attractions.",
        imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
        region: "North America"
    },
    {
        title: "Dubai",
        location: "UAE",
        description: "A modern marvel with stunning architecture, luxury shopping, and desert adventures.",
        imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
        region: "Middle East"
    },
    {
        title: "Safari in Serengeti",
        location: "Tanzania",
        description: "Witness the great migration and see Africa's incredible wildlife in their natural habitat.",
        imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
        region: "Africa"
    },
    {
        title: "Great Barrier Reef",
        location: "Australia",
        description: "The world's largest coral reef system, a paradise for divers and marine life enthusiasts.",
        imageUrl: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1200&q=80",
        region: "Oceania"
    },
    {
        title: "Iceland",
        location: "Iceland",
        description: "Land of fire and ice - Northern Lights, geysers, waterfalls, and volcanic landscapes.",
        imageUrl: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=1200&q=80",
        region: "Europe"
    },
    {
        title: "Marrakech",
        location: "Morocco",
        description: "Vibrant souks, beautiful riads, and the magic of North African culture.",
        imageUrl: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80",
        region: "Africa"
    }
];

/**
 * GET /api/destinations
 * Returns all destinations
 */
router.get("/", async (req, res) => {
    try {
        let destinations = await Destination.find().sort({ createdAt: -1 });

        // If no destinations exist, seed the database
        if (destinations.length === 0) {
            await Destination.insertMany(seedDestinations);
            destinations = await Destination.find().sort({ createdAt: -1 });
        }

        res.json(destinations);
    } catch (err) {
        console.error("GET /api/destinations error:", err);
        res.status(500).json({ message: "Failed to fetch destinations" });
    }
});

/**
 * GET /api/destinations/preview
 * Returns only 3 destinations for homepage preview
 */
router.get("/preview", async (req, res) => {
    try {
        let destinations = await Destination.find().limit(3);

        // If no destinations exist, seed the database
        if (destinations.length === 0) {
            await Destination.insertMany(seedDestinations);
            destinations = await Destination.find().limit(3);
        }

        res.json(destinations);
    } catch (err) {
        console.error("GET /api/destinations/preview error:", err);
        res.status(500).json({ message: "Failed to fetch destinations" });
    }
});

export default router;

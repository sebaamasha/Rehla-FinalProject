import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model("Destination", destinationSchema);

import mongoose, { Schema } from "mongoose";
import { IWaypoint } from "./waypoint.interface";

const WaypointSchema: Schema = new Schema<IWaypoint>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  photos: [{ type: String, required: true }],
  location: {
    type: {
      type: String,
      enum: ["Point"], // Optional: if you're using GeoJSON
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  wether: {
    sunrise: { type: String, required: true },
    cloud: { type: String, required: true },
    humidity: { type: String, required: true },
  },
});

// Optional: Add 2dsphere index if using Geo queries
WaypointSchema.index({ location: "2dsphere" });

export const Waypoint = mongoose.model<IWaypoint>("Waypoint", WaypointSchema);

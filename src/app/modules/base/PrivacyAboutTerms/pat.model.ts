import { model, Schema } from "mongoose";
import { IPat } from "./pat.interface";

const patSchema = new Schema<IPat>({
  body: {
    type: String,
    required: true,
  },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["privacy-policy", "terms-condition", "about-us"],
  },
});

export const PrivacyAboutTerms = model<IPat>("PrivacyAboutTerms", patSchema);

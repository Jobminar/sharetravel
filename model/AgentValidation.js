import mongoose from "mongoose";

const aadharValidationSchema = new mongoose.Schema({
  aadhaar_number: { type: String, required: true, unique: true },
  age_range: String,
  state: String,
  is_mobile: Boolean,
  gender: String,
  last_digits: String,
  client_id: String,
  request_count: { type: Number, default: 0 },
  last_requested: Date,
});
export const AadharValidation = mongoose.model(
  "AadharValidation",
  aadharValidationSchema,
);

import { Schema, model } from "mongoose";

// Define a schema for service types, like cleaning, plumbing, etc.
const ServiceTypeSchema = new Schema({
  serviceTypeName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  serviceTypeImage: {
    type: Buffer,
    required: true,
  },
});

// Define the main service schema
const ServiceSchema = new Schema({
  serviceName: {
    type: String,
    required: true,
    trim: true,
  },
  serviceCost: {
    type: Number,
    required: true,
    min: 0,
  },
  serviceType: {
    type: Schema.Types.ObjectId,
    ref: "ServiceType",
    required: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  charges: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

// Compile the schemas into models
const Service = model("Service", ServiceSchema);
const ServiceType = model("ServiceType", ServiceTypeSchema);

// Correctly export the models as named exports
export { Service, ServiceType };

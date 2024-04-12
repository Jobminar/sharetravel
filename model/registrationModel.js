import { model, Schema } from "mongoose";
const registrationSchema = new Schema({
  name: { type: String, required: true },
  eamil: { type: String, required: true },
  phone: { type: String, required: true },
  certificate: { type: String, type: true },
});
const Registration = model("Registration", registrationSchema);
export default Registration;

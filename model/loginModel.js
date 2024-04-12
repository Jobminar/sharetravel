import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    otpCreatedAt: { type: Date }, // Include otpCreatedAt field
});

const User = model("User", userSchema);
export default User;

import nodemailer from "nodemailer";
import User from "../model/loginModel.js"; // Assuming loginModel.js exports the User model
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  service: "gmail",
  auth: {
    user: "chandrasekhar8120@gmail.com",
    pass: "dhir wwpw kgcu dwqo",
  },
});

// Function to generate a random OTP
const generateOTP = () => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

const loginController = {
  sendCredentials: async (req, res) => {
    try {
      const { email } = req.body;

      // Generate a random OTP
      const otp = generateOTP();

      // Store the OTP and its creation timestamp in the database
      const otpCreatedAt = new Date();
      await User.findOneAndUpdate(
        { email },
        { otp, otpCreatedAt },
        { upsert: true },
      );

      // Generate JWT token for the user
      const token = jwt.sign({ email, otp }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Expires in 1 hour
      });

      // Send email with user's OTP and JWT token link
      const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
        to: email,
        subject: "Your OTP and Token",
        html: `<p>Your OTP: ${otp}</p><p>Use this token for verification: ${token}</p>`,
      });

      console.log("Message sent: %s", info.messageId);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      // Check if the provided OTP is valid and not expired
      const user = await User.findOne({
        email,
        otp,
        otpCreatedAt: { $gt: new Date(new Date() - 5 * 60000) },
      });

      if (user) {
        // OTP is valid
        res.status(200).json({ message: "OTP verification successful" });
      } else {
        // OTP is invalid or expired
        res.status(401).json({ error: "Invalid or expired OTP" });
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  },
};

export default loginController;

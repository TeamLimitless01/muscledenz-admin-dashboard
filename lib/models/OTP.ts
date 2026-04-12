import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email or phone
  otp: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.OTP || mongoose.model('OTP', OTPSchema);

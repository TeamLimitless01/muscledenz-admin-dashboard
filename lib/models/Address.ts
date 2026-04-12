import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  city: { type: String },
  country: { type: String },
  district: { type: String },
  state: { type: String },
  pincode: { type: Number },
  phone: { type: Number },
  streetAddress: { type: String },
  locality: { type: String },
  landmark: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedIdentifier: { type: String }
}, { timestamps: true });

export default mongoose.models.Address || mongoose.model('Address', AddressSchema);

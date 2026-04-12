import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  thumbnail: { type: String }, // URL to media
  slug: { type: String, unique: true },
  description: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);

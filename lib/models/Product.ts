import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String }, // Store URL of the image
  images: [{ type: String }], // Store URLs of images
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  collectionType: { type: String }, 
  ecomUrl: { type: String },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

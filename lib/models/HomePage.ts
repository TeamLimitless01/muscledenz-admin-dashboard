import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  stars: { type: Number, min: 1, max: 5 }
});

const AboutImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' }
});

const HomePageSchema = new mongoose.Schema({
  top_banners: [{ type: String }], // Array of image URLs
  about_images: [AboutImageSchema], // Array of objects with url, title, description
  reviews: [ReviewSchema], // Repeatable component
  headlineText: { type: String }
}, { timestamps: true });

// Ensure it behaves like a Single Type by always using the same ID or just returning the first one
export default mongoose.models.HomePage || mongoose.model('HomePage', HomePageSchema);

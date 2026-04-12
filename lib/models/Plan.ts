import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number }, // duration in days
  price: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Plan || mongoose.model('Plan', PlanSchema);

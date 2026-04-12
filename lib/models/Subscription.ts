import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  startDate: { type: Date },
  endDate: { type: Date },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  paidAmount: { type: Number },
  paid: { type: Boolean, default: false },
  expired: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }],
  currentPlanAmount: { type: Number },
}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);

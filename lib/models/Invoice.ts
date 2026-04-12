import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);

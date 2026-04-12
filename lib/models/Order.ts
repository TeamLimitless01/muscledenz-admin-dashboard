import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending' 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending' 
  },
  document: [{ type: String }], // Array of media URLs
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['COD', 'Online', 'Card', 'UPI'], 
    default: 'Online' 
  },
  couponDiscount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

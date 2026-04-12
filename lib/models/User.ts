import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  provider: { type: String, default: 'local' },
  password: { type: String },
  resetPasswordToken: { type: String },
  confirmationToken: { type: String },
  confirmed: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  role: { type: String, default: 'Authenticated' }, 
  firstname: { type: String },
  lastname: { type: String },
  identifier: { type: String }, 
  birthdate: { type: Date },
  type: { type: String, enum: ['Admin', 'User', 'GymOwner', 'Trainer'], default: 'User' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  profile: { type: String }, 
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }],
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }],
  isGymMember: { type: Boolean, default: false },
  phone: { type: String },
}, { timestamps: true });

interface IUser extends mongoose.Document {
  password?: string;
  isModified(path: string): boolean;
}

UserSchema.pre<IUser>('save', async function() {
  if (!this.isModified('password')) return;
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

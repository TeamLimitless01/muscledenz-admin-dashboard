import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTP from '@/lib/models/OTP';
import User from '@/lib/models/User';
import { sendOTP } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ success: false, message: 'Identifier is required' }, { status: 400 });
    }

    // Check if user exists and is admin (optional check here, can also be done in frontend as it currently is)
    const user = await User.findOne({ email: identifier });
    if (!user || user.type !== 'Admin') {
       // We still might want to send OTP to not reveal if user exists, but the current UI checks this.
       // For now, let's keep it consistent with the frontend expectations.
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save to DB
    await OTP.findOneAndUpdate(
      { identifier },
      { otp: otpCode, expiresAt, isVerified: false },
      { upsert: true, new: true }
    );

    // Send Email
    try {
      await sendOTP(identifier, otpCode);
    } catch (mailError) {
      console.error('Failed to send email:', mailError);
      // In development, you might want to return the OTP in the response if email fails
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ success: true, message: 'OTP generated (Email failed, check console)', otp: otpCode });
      }
      return NextResponse.json({ success: false, message: 'Failed to send OTP email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

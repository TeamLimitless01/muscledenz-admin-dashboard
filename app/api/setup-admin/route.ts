import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const salt = await bcrypt.genSalt(10);
    const hashedDevPassword = await bcrypt.hash('123123', salt);

    const adminData = {
      username: 'admin',
      email: 'admin@muscledenz.com',
      firstname: 'Demo',
      lastname: 'Admin',
      type: 'Admin',
      confirmed: true,
      identifier: 'admin@muscledenz.com',
      phone: '1234567890',
      password: hashedDevPassword // Use the hashed password
    };

    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      existing.password = hashedDevPassword;
      await existing.save();
      return NextResponse.json({ message: 'Admin password updated (hashed)', user: existing }, { status: 200 });
    }

    const admin = await User.create(adminData);
    return NextResponse.json({ message: 'Admin created successfully', user: admin }, { status: 201 });
  } catch (error: any) {
    console.error('Setup Admin Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

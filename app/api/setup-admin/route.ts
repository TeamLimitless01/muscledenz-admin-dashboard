import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const plainPassword = '7223913294';

    const adminData = {
      username: 'admin',
      email: 'denzmuscle@gmail.com',
      firstname: 'Mahesh',
      lastname: 'Kumar',
      type: 'Admin',
      confirmed: true,
      identifier: 'denzmuscle@gmail.com',
      phone: '7223913294',
      password: plainPassword 
    };

    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      existing.password = plainPassword;
      await existing.save();
      return NextResponse.json({ message: 'Admin password updated', user: existing }, { status: 200 });
    }

    const admin = await User.create(adminData);
    return NextResponse.json({ message: 'Admin created successfully', user: admin }, { status: 201 });
  } catch (error: any) {
    console.error('Setup Admin Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    // Support basic filtering by email/identifier as used in sign-in
    const email = searchParams.get('filters[email][$eq]');
    const identifier = searchParams.get('filters[identifier][$eq]');
    
    let query = {};
    if (email) query = { email };
    else if (identifier) query = { identifier };

    const users = await User.find(query);
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const user = await User.create(data);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

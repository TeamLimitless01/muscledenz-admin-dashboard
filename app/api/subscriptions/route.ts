import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Subscription from '@/lib/models/Subscription';

export async function GET() {
  try {
    await dbConnect();
    const subscriptions = await Subscription.find({}).populate(['user', 'plan']);
    return NextResponse.json(subscriptions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const subscription = await Subscription.create(data);
    return NextResponse.json(subscription, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

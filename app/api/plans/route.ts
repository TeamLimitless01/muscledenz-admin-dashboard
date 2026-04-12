import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/lib/models/Plan';

export async function GET() {
  try {
    await dbConnect();
    const plans = await Plan.find({});
    return NextResponse.json(plans);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const plan = await Plan.create(data);
    return NextResponse.json(plan, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HomePage from '@/lib/models/HomePage';

export async function GET() {
  try {
    await dbConnect();
    // In a Single Type, we always return the first document found
    let homePage = await HomePage.findOne({});
    
    if (!homePage) {
      // Return empty defaults if not yet created
      return NextResponse.json({
        top_banners: [],
        about_images: [],
        reviews: [],
        headlineText: ""
      });
    }
    
    return NextResponse.json(homePage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // UPSERT: Find the single entry and update it, or create if none exists
    const homePage = await HomePage.findOneAndUpdate(
      {}, 
      data, 
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    return NextResponse.json(homePage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

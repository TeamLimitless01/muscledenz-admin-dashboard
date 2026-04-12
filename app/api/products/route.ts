import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).populate('category');
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    let body = await req.json();
    
    // Handle Strapi-style { data: { ... } } wrapper
    let data = body.data || body;

    // Handle Strapi-style { connect: [ id ] } relations
    if (data.category && typeof data.category === 'object') {
      if (data.category.connect && data.category.connect.length > 0) {
        data.category = data.category.connect[0]; // Take the first ID
      } else if (data.category.connect && data.category.connect[0] === null) {
        data.category = null;
      }
    }

    const product = await Product.create(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

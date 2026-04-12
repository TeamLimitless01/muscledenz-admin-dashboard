import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import mongoose from 'mongoose';

// Helper to extract a single ID from various Strapi/Direct formats
const extractId = (value: any) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    // Check for Strapi 'connect' array
    if (Array.isArray(value.connect) && value.connect.length > 0) {
      return value.connect[0];
    }
    // Check for direct ID property if it's an object from a previous find
    if (value.id || value._id) return value.id || value._id;
  }
  return null;
};

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
    let data = body.data || body;

    // Normalize Category Relation
    const categoryId = extractId(data.category);
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
        data.category = categoryId;
    } else {
        delete data.category; // Avoid casting null/invalid strings if not provided
    }

    const product = await Product.create(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

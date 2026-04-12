import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import mongoose from 'mongoose';

const extractId = (value: any) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (Array.isArray(value.connect) && value.connect.length > 0) {
      return value.connect[0];
    }
    if (value.id || value._id) return value.id || value._id;
  }
  return null;
};

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id).populate('category');
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    let body = await req.json();
    let data = body.data || body;

    const categoryId = extractId(data.category);
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
        data.category = categoryId;
    } else {
        // If it was explicitly intended to be null, set it to null
        // Otherwise, if it was just missing/invalid, remove it to prevent overwrite
        if (data.category === null || (typeof data.category === 'object' && data.category?.connect?.[0] === null)) {
            data.category = null;
        } else {
            delete data.category;
        }
    }

    const product = await Product.findByIdAndUpdate(params.id, data, { new: true });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("PATCH Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

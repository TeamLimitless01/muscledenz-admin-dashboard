import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Subscription from '@/lib/models/Subscription';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();

    // 1. Fetch all necessary data for aggregation
    // In a real production app, we would use MongoDB aggregation pipelines for efficiency.
    // For this dashboard, we'll fetch and process to ensure accuracy with populated fields.

    const orders = await Order.find({ paymentStatus: 'Paid' }).populate('product');
    const subscriptions = await Subscription.find({ paid: true });
    const users = await User.find({});
    const products = await Product.find({}).populate('category');
    const categories = await Category.find({});

    // Helper to group by month
    const getMonthYear = (date: Date) => {
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    };

    // --- Process Orders ---
    let totalOrderRevenue = 0;
    const orderRevenueByMonth: Record<string, number> = {};
    const topProducts: Record<string, number> = {};

    orders.forEach(order => {
      totalOrderRevenue += order.amount || 0;
      
      const month = getMonthYear(order.createdAt);
      orderRevenueByMonth[month] = (orderRevenueByMonth[month] || 0) + order.amount;

      const productName = order.product?.name || 'Unknown Product';
      topProducts[productName] = (topProducts[productName] || 0) + (order.quantity || 1);
    });

    // --- Process Subscriptions ---
    let totalSubRevenue = 0;
    const subRevenueByMonth: Record<string, number> = {};
    let activeSubs = 0;
    let expiredSubs = 0;

    subscriptions.forEach(sub => {
      totalSubRevenue += sub.paidAmount || 0;
      
      const month = getMonthYear(sub.createdAt);
      subRevenueByMonth[month] = (subRevenueByMonth[month] || 0) + (sub.paidAmount || 0);

      if (sub.expired) expiredSubs++;
      else activeSubs++;
    });

    // --- Process Users ---
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const newUsersLast30Days = users.filter(user => new Date(user.createdAt) >= thirtyDaysAgo).length;

    // --- Process Products ---
    const productsByCategory: Record<string, number> = {};
    products.forEach(product => {
      const catName = product.category?.name || 'Uncategorized';
      productsByCategory[catName] = (productsByCategory[catName] || 0) + 1;
    });

    // Compile Final Response
    const analyticsData = {
      totals: {
        combinedRevenue: totalOrderRevenue + totalSubRevenue
      },
      orders: {
        revenue: totalOrderRevenue,
        total: orders.length,
        avgOrderValue: orders.length > 0 ? totalOrderRevenue / orders.length : 0,
        revenueByMonth: orderRevenueByMonth,
        topProducts: topProducts
      },
      subscriptions: {
        revenue: totalSubRevenue,
        total: subscriptions.length,
        active: activeSubs,
        expired: expiredSubs,
        revenueByMonth: subRevenueByMonth
      },
      users: {
        total: users.length,
        newUsers: {
          last30Days: newUsersLast30Days
        }
      },
      products: {
        byCategory: productsByCategory
      }
    };

    return NextResponse.json(analyticsData);
  } catch (error: any) {
    console.error("Dashboard Analytics Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

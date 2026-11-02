import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
const dataDir = path.join(process.cwd(), "data");
const ordersFilePath = path.join(dataDir, "orders.json");
function getSavedOrders() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(ordersFilePath)) {
      fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(ordersFilePath, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}
function saveOrders(orders) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving orders:", error);
  }
}
export async function GET() {
  try {
    const orders = getSavedOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const newOrder = await req.json();
    const orders = getSavedOrders();
    const orderRecord = {
      orderId: newOrder.orderId || `DG-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(1e4 + Math.random() * 9e4)}`,
      createdAt: newOrder.createdAt || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: newOrder.status || "Pending Verification",
      customer: newOrder.customer || {},
      items: newOrder.items || [],
      totals: newOrder.totals || { subtotal: 0, discount: 0, shipping: 0, total: 0 }
    };
    orders.unshift(orderRecord);
    saveOrders(orders);
    return NextResponse.json({ success: true, order: orderRecord });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function PUT(req) {
  try {
    const { orderId, status } = await req.json();
    const orders = getSavedOrders();
    const index = orders.findIndex((o) => o.orderId === orderId);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    orders[index].status = status;
    saveOrders(orders);
    return NextResponse.json({ success: true, order: orders[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId") || searchParams.get("id");
    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }
    const orders = getSavedOrders();
    const updated = orders.filter((o) => o.orderId !== orderId);
    saveOrders(updated);
    return NextResponse.json({ success: true, message: `Order ${orderId} deleted` });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function _optionalChain(ops) {
  let lastAccessLHS = void 0;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    const op = ops[i];
    const fn = ops[i + 1];
    i += 2;
    if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
      return void 0;
    }
    if (op === "access" || op === "optionalAccess") {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === "call" || op === "optionalCall") {
      value = fn((...args) => value.call(lastAccessLHS, ...args));
      lastAccessLHS = void 0;
    }
  }
  return value;
}
import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import fs from "fs";
import path from "path";
const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");
function getLocalSubscribers() {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const data = fs.readFileSync(SUBSCRIBERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading local subscribers file:", e);
  }
  return [];
}
function saveLocalSubscriber(subscriber) {
  try {
    const list = getLocalSubscribers();
    const existingIndex = list.findIndex((s) => s.email.toLowerCase() === subscriber.email.toLowerCase());
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...subscriber, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    } else {
      list.unshift(subscriber);
    }
    const dataDir = path.dirname(SUBSCRIBERS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(list, null, 2));
  } catch (e) {
    console.error("Error writing local subscriber file:", e);
  }
}
export async function GET() {
  try {
    const query = `*[_type == "subscriber"] | order(subscribedAt desc)`;
    const sanitySubscribers = await sanityClient.fetch(query).catch(() => []);
    if (Array.isArray(sanitySubscribers) && sanitySubscribers.length > 0) {
      return NextResponse.json({ success: true, subscribers: sanitySubscribers, source: "sanity" });
    }
    const localSubscribers = getLocalSubscribers();
    return NextResponse.json({ success: true, subscribers: localSubscribers, source: "local" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, source = "homepage_newsletter" } = body;
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid email address is required" },
        { status: 400 }
      );
    }
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }
    const subscriberDocId = `subscriber-${cleanEmail.replace(/[^a-z0-9]/g, "_")}`;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const subscriberData = {
      _type: "subscriber",
      _id: subscriberDocId,
      email: cleanEmail,
      source,
      status: "active",
      subscribedAt: timestamp,
      tags: ["newsletter", "storefront"]
    };
    let sanitySaved = false;
    try {
      await sanityClient.createOrReplace(subscriberData);
      sanitySaved = true;
    } catch (sanityErr) {
      console.warn("Warning: Could not save subscriber to Sanity direct:", _optionalChain([sanityErr, "optionalAccess", (_) => _.message]) || sanityErr);
    }
    saveLocalSubscriber({
      id: subscriberDocId,
      email: cleanEmail,
      source,
      status: "active",
      subscribedAt: timestamp,
      sanitySynced: sanitySaved
    });
    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing! Welcome to the DreamyGlows Club.",
      email: cleanEmail,
      sanitySynced: sanitySaved
    });
  } catch (error) {
    console.error("Error processing newsletter subscription:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

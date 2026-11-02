import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
const dataDir = path.join(process.cwd(), "data");
const inquiriesFilePath = path.join(dataDir, "inquiries.json");
function getSavedInquiries() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(inquiriesFilePath)) {
      const defaultInquiries = [
        {
          id: "inq-sample-1",
          name: "Hina Siddiqui",
          email: "hina.s@example.com",
          subject: "Skin Care Consultation",
          message: "Can I combine Dr. AR Mandelic Acid Serum with the OLIV-E-C Whitening Serum in the same routine?",
          createdAt: new Date(Date.now() - 36e5 * 12).toISOString(),
          status: "Unread"
        }
      ];
      fs.writeFileSync(inquiriesFilePath, JSON.stringify(defaultInquiries, null, 2), "utf-8");
      return defaultInquiries;
    }
    const data = fs.readFileSync(inquiriesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading inquiries:", error);
    return [];
  }
}
function saveInquiries(inquiries) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(inquiries, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving inquiries:", error);
  }
}
export async function GET() {
  try {
    const inquiries = getSavedInquiries();
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    const inquiries = getSavedInquiries();
    const newInquiry = {
      id: `inq-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || "Store Inquiry").trim(),
      message: message.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "Unread"
    };
    inquiries.unshift(newInquiry);
    saveInquiries(inquiries);
    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Our team will contact you shortly.",
      inquiry: newInquiry
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function PUT(req) {
  try {
    const { id, status } = await req.json();
    const inquiries = getSavedInquiries();
    const idx = inquiries.findIndex((inq) => inq.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }
    inquiries[idx].status = status;
    saveInquiries(inquiries);
    return NextResponse.json({ success: true, inquiry: inquiries[idx] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

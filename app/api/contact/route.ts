import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { deliverContactNotification } from "@/lib/contactDelivery";
export const maxDuration = 30;
import {
  getSupabaseServerConfig,
  supabaseServiceRoleEnvMessage,
} from "@/lib/serverEnv";

function cleanText(value: unknown, maxLength = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeWebsite(input: unknown) {
  let value = cleanText(input, 500);
  if (!value) return "";
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;

  try {
    const parsed = new URL(value);
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.hash = "";
    const path = parsed.pathname.replace(/\/+$/, "");
    parsed.pathname = path || "/";
    return parsed.toString().replace(/\/$/, (match) => (path === "/" ? match : ""));
  } catch {
    return "";
  }
}

async function sendContactEmail(contactRequest: {
  email: string;
  companyName: string;
  website: string;
  goal: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "sitescope.fyi <onboarding@resend.dev>";

  if (!apiKey || !toEmail) {
    return { sent: false, reason: "Email delivery is not configured." };
  }

  return deliverContactNotification(() => fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: AbortSignal.timeout(8000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: contactRequest.email,
      subject: `New sitescope.fyi contact request: ${contactRequest.companyName}`,
      text: [
        "New sitescope.fyi contact request",
        "",
        `Company: ${contactRequest.companyName}`,
        `Email: ${contactRequest.email}`,
        `Website: ${contactRequest.website || "Not provided"}`,
        `Goal: ${contactRequest.goal || "Not selected"}`,
        "",
        "Message:",
        contactRequest.message || "No message provided.",
      ].join("\n"),
    }),
  }));
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  try {
    const contactRequest = {
      email: cleanText(body.email, 320).toLowerCase(),
      companyName: cleanText(body.companyName, 200),
      website: normalizeWebsite(body.website),
      goal: cleanText(body.goal, 120),
      message: cleanText(body.message, 4000),
      source: cleanText(body.source, 120) || "contact-page",
    };

    if (!isValidEmail(contactRequest.email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!contactRequest.companyName) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 },
      );
    }

    const { url: supabaseUrl, serviceRoleKey: supabaseKey } =
      getSupabaseServerConfig();

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: `Contact storage is not configured. ${supabaseServiceRoleEnvMessage}`,
        },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("contact_requests")
      .insert([
        {
          email: contactRequest.email,
          company_name: contactRequest.companyName,
          website: contactRequest.website || null,
          goal: contactRequest.goal || null,
          message: contactRequest.message || null,
          source: contactRequest.source,
          status: "new",
        },
      ])
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        {
          error:
            error.code === "42P01"
              ? "Contact form is not ready yet. Please create the contact_requests table."
              : error.message,
        },
        { status: 500 },
      );
    }

    const emailResult = await sendContactEmail(contactRequest);

    if (!emailResult.sent) {
      console.warn(`Contact email not sent: ${emailResult.reason}`);
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      emailSent: emailResult.sent,
      deliveryStatus: emailResult.sent ? "sent" : "unavailable",
    });
  } catch {
    return NextResponse.json(
      {
        error: "Failed to save contact request. Please try again.",
      },
      { status: 500 },
    );
  }
}

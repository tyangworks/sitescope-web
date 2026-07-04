import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reportId = cleanText(body.reportId, 100);
    const email = cleanText(body.email, 320).toLowerCase();

    if (!reportId) {
      return NextResponse.json({ error: "reportId is required." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Enter a valid email to continue." },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error:
            "Credit redemption is not configured. Please set SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("id, is_paid")
      .eq("id", reportId)
      .maybeSingle();

    if (reportError) {
      return NextResponse.json({ error: reportError.message }, { status: 500 });
    }

    if (!report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    if (report.is_paid) {
      return NextResponse.json({ success: true, alreadyUnlocked: true });
    }

    const { data: credit, error: creditError } = await supabase
      .from("pro_audit_credits")
      .select("id")
      .eq("email", email)
      .eq("status", "available")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (creditError) {
      return NextResponse.json({ error: creditError.message }, { status: 500 });
    }

    if (!credit) {
      return NextResponse.json(
        { error: "No available Pro Audit credit found for this email." },
        { status: 404 },
      );
    }

    const { error: updateReportError } = await supabase
      .from("reports")
      .update({ is_paid: true })
      .eq("id", reportId);

    if (updateReportError) {
      return NextResponse.json(
        { error: updateReportError.message },
        { status: 500 },
      );
    }

    const { error: updateCreditError } = await supabase
      .from("pro_audit_credits")
      .update({
        status: "redeemed",
        redeemed_report_id: reportId,
        redeemed_at: new Date().toISOString(),
      })
      .eq("id", credit.id)
      .eq("status", "available");

    if (updateCreditError) {
      return NextResponse.json(
        { error: updateCreditError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      redeemed: true,
      reportId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to redeem Pro Audit credit.",
      },
      { status: 500 },
    );
  }
}

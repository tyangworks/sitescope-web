import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createStripeCheckoutSession({
  origin,
  reportId,
  customerEmail,
  purchaseType,
}: {
  origin: string;
  reportId: string;
  customerEmail: string;
  purchaseType: "report_unlock" | "pro_credit";
}) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePriceId = process.env.STRIPE_PRICE_ID;

  if (!stripeSecretKey || !stripePriceId) {
    return {
      ok: false,
      status: 500,
      data: {
        error: "Stripe Checkout is not configured.",
      },
    };
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("customer_email", customerEmail);
  if (reportId) params.set("client_reference_id", reportId);
  params.set("line_items[0][price]", stripePriceId);
  params.set("line_items[0][quantity]", "1");
  params.set("metadata[purchase_type]", purchaseType);
  if (reportId) params.set("metadata[report_id]", reportId);
  params.set("metadata[product]", "SiteScope Pro Audit");
  params.set(
    "success_url",
    `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
  );
  params.set(
    "cancel_url",
    reportId
      ? `${origin}/cancel?report_id=${encodeURIComponent(reportId)}`
      : `${origin}/cancel`,
  );

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await response.json();
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reportId = cleanText(body.reportId, 100);
    const customerEmail = cleanText(body.customerEmail, 320).toLowerCase();
    const purchaseType =
      cleanText(body.purchaseType, 50) === "pro_credit"
        ? "pro_credit"
        : "report_unlock";

    if (purchaseType === "report_unlock" && !reportId) {
      return NextResponse.json(
        { error: "reportId is required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(customerEmail)) {
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
            "Payment storage is not configured. Please set SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 },
      );
    }

    if (purchaseType === "report_unlock") {
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
        return NextResponse.json({
          success: true,
          alreadyPaid: true,
          url: `/report/${encodeURIComponent(reportId)}`,
        });
      }
    }

    const origin = new URL(request.url).origin;
    const stripeResult = await createStripeCheckoutSession({
      origin,
      reportId,
      customerEmail,
      purchaseType,
    });

    if (!stripeResult.ok) {
      return NextResponse.json(
        {
          error:
            stripeResult.data?.error?.message ||
            "Failed to create Stripe Checkout session.",
        },
        { status: stripeResult.status },
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: stripeResult.data.id,
      url: stripeResult.data.url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session.",
      },
      { status: 500 },
    );
  }
}

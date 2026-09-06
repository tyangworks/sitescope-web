import { NextRequest, NextResponse } from "next/server";
import { preparePurchaseReport, PurchaseAccessError } from "@/lib/reports/purchase";
import {
  getSupabaseServerConfig,
  supabaseServiceRoleEnvMessage,
} from "@/lib/serverEnv";
import { isAdminUser } from "@/lib/auth/admin";
import { getRequestUser } from "@/lib/reports/server";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let reportId = cleanText(body.reportId, 100);
    let customerEmail = cleanText(body.customerEmail, 320).toLowerCase();
    const purchaseType =
      cleanText(body.purchaseType, 50) === "pro_credit"
        ? "pro_credit"
        : "report_unlock";

    const user = await getRequestUser(request);
    if (user?.email) customerEmail = user.email.toLowerCase();
    const isAdminReportUnlock = purchaseType === "report_unlock" && isAdminUser(user);
    if (purchaseType === "pro_credit" && isAdminUser(user)) {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        adminUnlocked: true,
        url: "/",
      });
    }

    if (purchaseType === "report_unlock" && !reportId) {
      return NextResponse.json(
        { error: "reportId is required." },
        { status: 400 },
      );
    }

    if (!isAdminReportUnlock && !isValidEmail(customerEmail)) {
      return NextResponse.json(
        { error: "Enter a valid email to continue." },
        { status: 400 },
      );
    }

    const { url: supabaseUrl, serviceRoleKey: supabaseKey } =
      getSupabaseServerConfig();

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: `Payment storage is not configured. ${supabaseServiceRoleEnvMessage}`,
        },
        { status: 500 },
      );
    }

    if (purchaseType === "report_unlock") {
      if (isAdminReportUnlock) {
        return NextResponse.json({
          success: true,
          alreadyPaid: true,
          adminUnlocked: true,
          url: `/report/${encodeURIComponent(reportId)}`,
        });
      }

      const report = await preparePurchaseReport(request, reportId, user?.id || null);
      reportId = report.id;
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
    if (error instanceof PurchaseAccessError) return NextResponse.json({ error: error.message }, { status: error.status });
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

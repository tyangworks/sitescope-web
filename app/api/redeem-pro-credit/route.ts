import { NextRequest, NextResponse } from "next/server";
import { createReportServiceClient, getRequestUser } from "@/lib/reports/server";
import { preparePurchaseReport, PurchaseAccessError } from "@/lib/reports/purchase";

export async function POST(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ error: "Sign in to use an existing Pro credit." }, { status: 401 });
    const body = await request.json();
    if (typeof body.reportId !== "string") return NextResponse.json({ error: "Report ID required." }, { status: 400 });
    const report = await preparePurchaseReport(request, body.reportId, user.id);
    const db = createReportServiceClient();
    const { data, error } = await db.rpc("redeem_owned_pro_credit", { p_report_id: report.id, p_user_id: user.id });
    if (error) return NextResponse.json({ error: "Credit service unavailable. No payment was taken." }, { status: 503 });
    if (!data) return NextResponse.json({ error: "No available credit for this account." }, { status: 404 });
    return NextResponse.json({ success: true, reportId: report.id, url: `/report/${report.id}` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof PurchaseAccessError ? error.message : "Unable to redeem credit." }, { status: error instanceof PurchaseAccessError ? error.status : 500 });
  }
}

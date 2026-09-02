import { isAdminUser } from "@/lib/auth/admin";
import { getRequestUser } from "@/lib/reports/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getRequestUser(request);
  return Response.json(
    {
      authenticated: Boolean(user),
      email: user?.email || null,
      isAdmin: isAdminUser(user),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

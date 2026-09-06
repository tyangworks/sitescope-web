export async function deliverContactNotification(
  send: () => Promise<Response>,
): Promise<{ sent: boolean; reason: string }> {
  try {
    const response = await send();
    return response.ok
      ? { sent: true, reason: "" }
      : { sent: false, reason: `provider_http_${response.status}` };
  } catch {
    // Storage has already succeeded. Delivery failure must not undo acceptance.
    return { sent: false, reason: "provider_unavailable" };
  }
}

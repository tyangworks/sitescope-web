import test from "node:test";
import assert from "node:assert/strict";
import { deliverContactNotification } from "../lib/contactDelivery.ts";
test("accepted lead survives mail HTTP failure, network failure and timeout", async () => {
  assert.equal((await deliverContactNotification(async () => new Response(null, { status: 200 }))).sent, true);
  assert.equal((await deliverContactNotification(async () => new Response("private provider response", { status: 500 }))).reason, "provider_http_500");
  for (const error of [new Error("network"), new DOMException("timeout", "TimeoutError")]) {
    assert.deepEqual(await deliverContactNotification(async () => { throw error; }), { sent: false, reason: "provider_unavailable" });
  }
});

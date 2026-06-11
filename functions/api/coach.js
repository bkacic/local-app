export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: "Server is missing ANTHROPIC_API_KEY secret." }, 500);
  }
  const body = await request.text();
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body,
  });
  const text = await upstream.text();
  return new Response(text, { status: upstream.status, headers: { "Content-Type": "application/json" } });
}
export async function onRequestGet() {
  return json({ ok: true, hint: "POST chat messages here." }, 200);
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

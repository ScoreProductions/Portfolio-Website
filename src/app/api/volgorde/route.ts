import { timingSafeEqual } from "node:crypto";

// Saves a new portfolio order by committing site.json to GitHub; Vercel then redeploys.
// Needs env vars: ADMIN_PASSWORD, GITHUB_TOKEN (contents read/write), optional GITHUB_REPO and GITHUB_BRANCH.
const REPO = process.env.GITHUB_REPO ?? "scoreproductions/portfolio-website";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const FILE = "src/content/site.json";

function passwordOk(given: unknown) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof given !== "string") return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const { password, order } = await request.json().catch(() => ({}));
  if (!passwordOk(password)) return Response.json({ error: "Wachtwoord klopt niet." }, { status: 401 });
  if (!Array.isArray(order) || !order.every((t) => typeof t === "string")) {
    return Response.json({ error: "Ongeldige volgorde." }, { status: 400 });
  }
  const token = process.env.GITHUB_TOKEN;
  if (!token) return Response.json({ error: "GITHUB_TOKEN ontbreekt op de server." }, { status: 500 });

  const api = `https://api.github.com/repos/${REPO}/contents/${FILE}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };

  const current = await fetch(`${api}?ref=${BRANCH}`, { headers, cache: "no-store" });
  if (!current.ok) return Response.json({ error: `GitHub lezen mislukt (${current.status}).` }, { status: 502 });
  const { sha, content } = await current.json();
  const data = JSON.parse(Buffer.from(content, "base64").toString("utf8"));

  // Reorder by title; projects missing from the list keep their relative order at the end.
  const rank = new Map(order.map((t: string, i: number) => [t, i]));
  const projects = data.projects as { title: string }[];
  data.projects = [...projects].sort((a, b) => (rank.get(a.title) ?? order.length) - (rank.get(b.title) ?? order.length));

  const res = await fetch(api, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: "Update portfolio order via /beheer",
      content: Buffer.from(JSON.stringify(data, null, 2) + "\n").toString("base64"),
      sha,
      branch: BRANCH,
    }),
  });
  if (!res.ok) return Response.json({ error: `GitHub opslaan mislukt (${res.status}).` }, { status: 502 });
  return Response.json({ ok: true });
}

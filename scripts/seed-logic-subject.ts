/**
 * Seed: Logic & Critical Thinking subject
 * Creates subject → categories → modules → lesson stubs (no blocks).
 * Lesson content is added via the dashboard layout builder.
 *
 * Run:  npx tsx scripts/seed-logic-subject.ts
 * Idempotent: skips any record that already exists.
 */

const BASE = "http://localhost:3000/api";
const SUPABASE_URL = "https://ypdfaegmuxxxiamhswgk.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZGZhZWdtdXh4eGlhbWhzd2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQzMjYyMywiZXhwIjoyMDkwMDA4NjIzfQ.6v-24nO6Pi3NP39ZDPxY7p9BIcwlkC236zvGo2n8H7s";

const SEED_EMAIL = "seed@admin.com";
const SEED_PASS  = "Seed1234!";

// ── helpers ──────────────────────────────────────────────────────────────────

async function post(path: string, body: unknown, cookie?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cookie) headers["Cookie"] = cookie;
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: unknown;
  try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) {
    console.error(`POST ${path} → ${res.status}`, json);
    throw new Error(`HTTP ${res.status} on POST ${path}`);
  }
  return json;
}

async function supabaseGet(path: string): Promise<Array<Record<string, string>>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase GET ${path}: ${res.status}`);
  return res.json() as Promise<Array<Record<string, string>>>;
}

async function supabasePatch(table: string, filter: string, body: unknown) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Supabase PATCH ${table}: ${JSON.stringify(json)}`);
  return json;
}

async function upsertSubject(
  body: { name: string; description: string; position: number },
  slug: string,
): Promise<string> {
  const existing = await supabaseGet(`subjects?slug=eq.${slug}&select=id`);
  if (existing.length > 0) {
    console.log(`  ~ subject "${body.name}" already exists`);
    return existing[0]!.id;
  }
  const res = await post("/subjects", body) as { data?: { id?: string } };
  const id = res.data?.id!;
  // Patch slug to desired value (auto-generated slug may differ from target)
  await supabasePatch("subjects", `id=eq.${id}`, { slug });
  console.log(`  ✓ subject "${body.name}" → slug:${slug} (${id})`);
  return id;
}

async function upsertCategory(
  body: { name: string; subjectId: string; position: number },
  subjectId: string,
): Promise<string> {
  const encodedName = encodeURIComponent(body.name);
  const existing = await supabaseGet(
    `categories?name=eq.${encodedName}&subject_id=eq.${subjectId}&select=id`,
  );
  if (existing.length > 0) {
    console.log(`  ~ category "${body.name}" already exists`);
    return existing[0]!.id;
  }
  await post("/categories", body);
  const rows = await supabaseGet(
    `categories?name=eq.${encodedName}&subject_id=eq.${subjectId}&select=id`,
  );
  const id = rows[0]!.id;
  console.log(`  ✓ category "${body.name}" (${id})`);
  return id;
}

async function upsertModule(body: {
  name: string;
  slug: string;
  position: number;
  categoryId: string;
}): Promise<string> {
  const existing = await supabaseGet(`modules?slug=eq.${body.slug}&select=id`);
  if (existing.length > 0) {
    console.log(`  ~ module "${body.name}" already exists`);
    return existing[0]!.id;
  }
  await post("/modules", body);
  const rows = await supabaseGet(`modules?slug=eq.${body.slug}&select=id`);
  const id = rows[0]!.id;
  console.log(`  ✓ module "${body.name}" (${id})`);
  return id;
}

async function upsertLesson(
  body: {
    moduleId: string;
    title: string;
    description: string;
    durationSeconds: number;
    position: number;
    isActive: boolean;
  },
  cookie: string,
): Promise<string> {
  const encodedTitle = encodeURIComponent(body.title);
  const existing = await supabaseGet(
    `lessons?module_id=eq.${body.moduleId}&title=eq.${encodedTitle}&select=id`,
  );
  if (existing.length > 0) {
    console.log(`    ~ "${body.title}" already exists`);
    return existing[0]!.id;
  }
  const res = await post("/lessons", body, cookie) as { data?: { id?: string } };
  const id = res.data?.id!;
  console.log(`    ✓ "${body.title}" (${id})`);
  return id;
}

// ── data ─────────────────────────────────────────────────────────────────────

const MODULES = {
  argumentsAndStructure: {
    name: "Arguments & Structure",
    slug: "arguments-and-structure",
    position: 1,
    lessons: [
      { position: 1, title: "What Is an Argument",       description: "Learn to distinguish arguments from opinions, and identify the logical structure that connects premises to a conclusion.",                     durationSeconds: 900  },
      { position: 2, title: "Premises & Conclusions",    description: "Master the language of logic: find conclusion indicators, isolate premises, and map the architecture of any argument.",                       durationSeconds: 900  },
      { position: 3, title: "Deductive vs Inductive",    description: "Understand the fundamental divide between certainty and probability in reasoning — and why it matters for LSAT and GMAT.",                   durationSeconds: 900  },
      { position: 4, title: "Common Logical Fallacies",  description: "Recognize the 7 most frequent reasoning errors in standardized tests: from ad hominem to correlation/causation traps.",                      durationSeconds: 1200 },
    ],
  },
  deductiveReasoning: {
    name: "Deductive Reasoning",
    slug: "deductive-reasoning",
    position: 2,
    lessons: [
      { position: 1, title: "Intro to Logic Grids",         description: "Step-by-step method for solving constraint satisfaction puzzles using only deduction — no guessing allowed.",                               durationSeconds: 1200 },
      { position: 2, title: "Logic Grids — Intermediate",   description: "Tackle 4×4 grids with negative constraints and relative conditions using systematic elimination.",                                         durationSeconds: 1200 },
      { position: 3, title: "Syllogisms",                   description: "Classical and hypothetical syllogisms: verify validity by form, not content — and spot the common traps.",                                 durationSeconds: 900  },
      { position: 4, title: "Deductive Puzzles",            description: "Knights and Knaves, Einstein's Riddle variants — pure deduction under strict information constraints.",                                    durationSeconds: 900  },
    ],
  },
  lsatLogicalReasoning: {
    name: "Logical Reasoning",
    slug: "lsat-logical-reasoning",
    position: 1,
    lessons: [
      { position: 1, title: "Anatomy of an LSAT Argument",  description: "Dissect the structure of LSAT LR passages: background, premises, conclusion, stem, and answer choices — and the strategy for each.",    durationSeconds: 1200 },
      { position: 2, title: "Assumption Questions",         description: "Find the hidden link between premises and conclusion using the Negation Test — the most reliable technique for assumption questions.",    durationSeconds: 1200 },
      { position: 3, title: "Strengthen & Weaken",          description: "Learn to distinguish information that supports vs. undermines an argument, and avoid the neutrality trap in answer choices.",             durationSeconds: 1200 },
      { position: 4, title: "Flaw in Reasoning",            description: "Identify the logical defect in an argument and match it to the abstract descriptions used in LSAT answer choices.",                       durationSeconds: 1200 },
      { position: 5, title: "Inference Questions",          description: "Must be true vs. most supported: how conservative inference protects you from over-reading LSAT passages.",                               durationSeconds: 1200 },
      { position: 6, title: "Parallel Reasoning",           description: "Abstract any argument to its logical form (A, B, C) and match structural parallels across completely different domains.",                 durationSeconds: 1200 },
    ],
  },
  gmatCriticalReasoning: {
    name: "Critical Reasoning",
    slug: "gmat-critical-reasoning",
    position: 1,
    lessons: [
      { position: 1, title: "GMAT Argument Structure",  description: "How GMAT CR differs from LSAT LR: shorter passages, distinct question types, and the process that maximizes accuracy under time pressure.",  durationSeconds: 1200 },
      { position: 2, title: "Boldface Questions",       description: "Identify the role of bolded sentences in GMAT arguments — and why confusing supporting evidence with counterpoint is the #1 mistake.",        durationSeconds: 1200 },
      { position: 3, title: "Evaluate the Argument",    description: "Find the single piece of information that would most help assess whether a conclusion holds — a disciplined approach to relevance.",          durationSeconds: 1200 },
      { position: 4, title: "Complete the Argument",    description: "Fill in a missing premise or conclusion using logical necessity — not intuition, not probability.",                                           durationSeconds: 1200 },
    ],
  },
  argumentAnalysis: {
    name: "Argument Analysis",
    slug: "logic-argument-analysis",
    position: 1,
    lessons: [
      { position: 1, title: "Hidden Assumptions",         description: "Surface the unstated beliefs that hold an argument together — and test their vulnerability with systematic negation.",                      durationSeconds: 1200 },
      { position: 2, title: "Evaluating Evidence",        description: "A four-criteria checklist for evidence quality: relevance, sufficiency, representativeness, and source integrity.",                        durationSeconds: 1200 },
      { position: 3, title: "Building Counterarguments",  description: "Attack premises and assumptions — not conclusions. What makes a counterargument effective vs. merely contradictory.",                      durationSeconds: 1200 },
      { position: 4, title: "Multi-Layer Arguments",      description: "Map arguments with sub-conclusions, intermediate steps, and nested structures — and identify where each layer is vulnerable.",              durationSeconds: 1200 },
    ],
  },
} as const;

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── 1. Auth ────────────────────────────────────────────────────────────────
  console.log("\n── Auth ─────────────────────────────────────────────────");

  await post("/auth/register", { email: SEED_EMAIL, password: SEED_PASS })
    .catch(() => console.log("  ~ Seed user already registered"));

  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: SEED_EMAIL, password: SEED_PASS }),
  });
  await loginRes.json();
  const rawCookies = loginRes.headers.getSetCookie?.() ?? [];
  const cookieHeader = rawCookies.map((c) => c.split(";")[0]).join("; ");
  console.log("  ✓ Logged in");

  // ── 2. Subject ────────────────────────────────────────────────────────────
  console.log("\n── Subject ──────────────────────────────────────────────");

  const subjectId = await upsertSubject(
    {
      name: "Logic & Critical Thinking",
      description: "Master logical reasoning, argumentation, and critical thinking — from first principles to LSAT/GMAT.",
      position: 2,
    },
    "logic-and-critical-thinking",
  );

  // ── 3. Categories ─────────────────────────────────────────────────────────
  console.log("\n── Categories ───────────────────────────────────────────");

  const catFoundationsId    = await upsertCategory({ name: "Foundations",       subjectId, position: 1 }, subjectId);
  const catLsatId           = await upsertCategory({ name: "LSAT Prep",         subjectId, position: 2 }, subjectId);
  const catGmatId           = await upsertCategory({ name: "GMAT Prep",         subjectId, position: 3 }, subjectId);
  const catAdvancedId       = await upsertCategory({ name: "Advanced Analysis", subjectId, position: 4 }, subjectId);

  // ── 4. Modules ────────────────────────────────────────────────────────────
  console.log("\n── Modules ──────────────────────────────────────────────");

  const mod1Id = await upsertModule({ ...MODULES.argumentsAndStructure,  categoryId: catFoundationsId });
  const mod2Id = await upsertModule({ ...MODULES.deductiveReasoning,     categoryId: catFoundationsId });
  const mod3Id = await upsertModule({ ...MODULES.lsatLogicalReasoning,   categoryId: catLsatId        });
  const mod4Id = await upsertModule({ ...MODULES.gmatCriticalReasoning,  categoryId: catGmatId        });
  const mod5Id = await upsertModule({ ...MODULES.argumentAnalysis,       categoryId: catAdvancedId    });

  // ── 5. Lessons ────────────────────────────────────────────────────────────
  console.log("\n── Lessons — Arguments & Structure ─────────────────────");
  for (const l of MODULES.argumentsAndStructure.lessons) {
    await upsertLesson({ moduleId: mod1Id, isActive: true, ...l }, cookieHeader);
  }

  console.log("\n── Lessons — Deductive Reasoning ────────────────────────");
  for (const l of MODULES.deductiveReasoning.lessons) {
    await upsertLesson({ moduleId: mod2Id, isActive: true, ...l }, cookieHeader);
  }

  console.log("\n── Lessons — LSAT Logical Reasoning ─────────────────────");
  for (const l of MODULES.lsatLogicalReasoning.lessons) {
    await upsertLesson({ moduleId: mod3Id, isActive: true, ...l }, cookieHeader);
  }

  console.log("\n── Lessons — GMAT Critical Reasoning ────────────────────");
  for (const l of MODULES.gmatCriticalReasoning.lessons) {
    await upsertLesson({ moduleId: mod4Id, isActive: true, ...l }, cookieHeader);
  }

  console.log("\n── Lessons — Argument Analysis ──────────────────────────");
  for (const l of MODULES.argumentAnalysis.lessons) {
    await upsertLesson({ moduleId: mod5Id, isActive: true, ...l }, cookieHeader);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`
── Done ─────────────────────────────────────────────────

  Subject: Logic & Critical Thinking  (slug: logic-and-critical-thinking)
  │
  ├── Foundations
  │   ├── Arguments & Structure    (${MODULES.argumentsAndStructure.lessons.length} lessons)
  │   └── Deductive Reasoning      (${MODULES.deductiveReasoning.lessons.length} lessons)
  │
  ├── LSAT Prep
  │   └── Logical Reasoning        (${MODULES.lsatLogicalReasoning.lessons.length} lessons)
  │
  ├── GMAT Prep
  │   └── Critical Reasoning       (${MODULES.gmatCriticalReasoning.lessons.length} lessons)
  │
  └── Advanced Analysis
      └── Argument Analysis        (${MODULES.argumentAnalysis.lessons.length} lessons)

  Total: 20 lesson stubs created.
  Next: add content via dashboard layout builder.
  Ref:  docs/features/feature-logical-reasoning-subject.md
`);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message);
  process.exit(1);
});

/**
 * Seed: L1.1 — What Is an Argument (content blocks)
 * Finds the lesson stub and creates a single content block with all 9 nodes.
 *
 * Run:  npx tsx scripts/seed-logic-l1-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only (array+states), so "examples" here
 * are rendered as a concept block with labeled sections instead.
 */

const BASE = "http://localhost:3000/api";
const SUPABASE_URL = "https://ypdfaegmuxxxiamhswgk.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZGZhZWdtdXh4eGlhbWhzd2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQzMjYyMywiZXhwIjoyMDkwMDA4NjIzfQ.6v-24nO6Pi3NP39ZDPxY7p9BIcwlkC236zvGo2n8H7s";

const SEED_EMAIL = "seed@admin.com";
const SEED_PASS  = "Seed1234!";

// ── helpers ──────────────────────────────────────────────────────────────────

async function post(path: string, body: unknown, cookie: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
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

async function supabaseGet(path: string): Promise<Array<Record<string, unknown>>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase GET ${path}: ${res.status}`);
  return res.json() as Promise<Array<Record<string, unknown>>>;
}

// ── content ───────────────────────────────────────────────────────────────────

const L1_1_CONTENT = [
  {
    type: "heading",
    text: "Ce este un argument logic",
    level: 2,
  },
  {
    type: "concept",
    title: "Definiție formală",
    sections: [
      {
        label: "Ce este",
        text: "Un argument logic este o structură formată din una sau mai multe premise care susțin o concluzie. Spre deosebire de o simplă afirmație, argumentul oferă motive — premise — care justifică de ce concluzia ar trebui acceptată.",
      },
      {
        label: "Componente",
        text: "Premise: propoziții considerate adevărate din care pornește raționamentul. Concluzie: propoziția pe care argumentul încearcă să o demonstreze. Relația logică: legătura dintre premise și concluzie care face ca aceasta din urmă să decurgă din primele.",
      },
      {
        label: "Diferența față de opinie",
        text: "O opinie este o credință sau preferință personală fără premise explicite. Un argument aduce dovezi sau raționamente care susțin concluzia. \"Îmi place această politică\" este o opinie. \"Această politică a redus rata criminalității cu 20%, deci ar trebui extinsă\" este un argument.",
      },
    ],
  },
  {
    type: "paragraph",
    text: "Argumentele nu sunt certuri — sunt structuri cu premise și o concluzie care decurge din ele. Scopul unui argument nu este de a câștiga o dezbatere, ci de a oferi motive raționale pentru acceptarea unei concluzii.",
  },
  {
    type: "heading",
    text: "Cum recunoști un argument",
    level: 2,
  },
  {
    type: "steps",
    steps: [
      {
        title: "Identifică concluzia",
        content: [
          {
            type: "paragraph",
            text: "Întreabă-te: ce susține autorul? Ce vrea să dovedească? Concluzia este adesea introdusă de cuvinte ca \"deci\", \"prin urmare\", \"în concluzie\", \"rezultă că\".",
          },
        ],
      },
      {
        title: "Identifică premisele",
        content: [
          {
            type: "paragraph",
            text: "Întreabă-te: de ce susține autorul asta? Ce motive oferă? Premisele sunt adesea introduse de cuvinte ca \"deoarece\", \"pentru că\", \"dat fiind că\", \"știind că\".",
          },
        ],
      },
      {
        title: "Verifică dacă concluzia decurge din premise",
        content: [
          {
            type: "paragraph",
            text: "Dacă premisele sunt adevărate, concluzia ar trebui să urmeze logic. Dacă există un salt logic neexplicat — un gap — argumentul are o problemă.",
          },
        ],
      },
    ],
  },
  {
    type: "concept",
    title: "Exemple",
    sections: [
      {
        label: "Argument valid",
        text: "Premisă 1: Toți oamenii sunt muritori. Premisă 2: Socrate este om. Concluzie: Deci, Socrate este muritor. ✓ Concluzia decurge logic din ambele premise — dacă ambele premise sunt adevărate, concluzia nu poate fi falsă.",
      },
      {
        label: "Argument invalid",
        text: "Premisă 1: Unii politicieni mint. Premisă 2: Ion este politician. Concluzie: Deci, Ion minte. ✗ Concluzia nu decurge logic — faptul că unii mint nu înseamnă că toți mint. Există un salt de la \"unii\" la \"toți\".",
      },
      {
        label: "Opinie fără argumente",
        text: "\"Cred că programele de burse ar trebui extinse.\" Nu există premise — nicio dovadă, niciun raționament, nicio structură logică. Este o preferință personală, nu un argument.",
      },
    ],
  },
  {
    type: "think",
    question: "În exemplul 2, de ce concluzia NU decurge din premise?",
    reveal: "Premisa spune că \"unii\" politicieni mint — nu \"toți\". Saltul logic de la \"unii\" la \"toți\" este o generalizare pripită (hasty generalization). Pentru ca concluzia să fie validă, premisa ar trebui să spună că \"toți politicienii mint\" — dar aceasta ar fi și falsă și aproape imposibil de demonstrat.",
  },
  {
    type: "recall",
    questions: [
      {
        question: "\"Exercițiul fizic îmbunătățește sănătatea cardiovasculară. Maria face exerciții zilnic. Deci, Maria are o sănătate cardiovasculară mai bună.\" Care este concluzia?",
        options: [
          "Exercițiul fizic îmbunătățește sănătatea cardiovasculară.",
          "Maria face exerciții zilnic.",
          "Maria are o sănătate cardiovasculară mai bună.",
          "Exercițiul fizic este important.",
        ],
        correct: 2,
      },
      {
        question: "\"Deoarece temperatura medie a crescut în ultimii 50 de ani și consumul de combustibili fosili a crescut în același interval, combustibilii fosili cauzează încălzirea globală.\" Care este problema cu acest argument?",
        options: [
          "Nu are premize.",
          "Tratează corelația ca și cum ar fi cauzalitate.",
          "Concluzia contrazice premisele.",
          "Nu există nicio problemă — argumentul este valid.",
        ],
        correct: 1,
      },
      {
        question: "Care dintre următoarele este o opinie (nu un argument)?",
        options: [
          "Deoarece prețurile au crescut cu 15%, inflația a afectat puterea de cumpărare.",
          "Studiile arată că lectura zilnică îmbunătățește vocabularul, deci ar trebui să citim mai mult.",
          "Cred că educația ar trebui să fie gratuită.",
          "Dat fiind că rata șomajului a scăzut, economia se îmbunătățește.",
        ],
        correct: 2,
      },
    ],
  },
  {
    type: "inline-quiz",
    question: "\"Toți studenții care studiază zilnic obțin note mari. Andrei studiază zilnic. Deci, Andrei obține note mari.\" Acesta este un argument valid sau o opinie?",
    options: ["Argument valid", "Opinie", "Argument invalid", "Nu e clar"],
    correct: 0,
  },
];

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── 1. Auth ────────────────────────────────────────────────────────────────
  console.log("\n── Auth ─────────────────────────────────────────────────");

  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: SEED_EMAIL, password: SEED_PASS }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
  await loginRes.json();
  const rawCookies = loginRes.headers.getSetCookie?.() ?? [];
  const cookieHeader = rawCookies.map((c) => c.split(";")[0]).join("; ");
  console.log("  ✓ Logged in");

  // ── 2. Find lesson ─────────────────────────────────────────────────────────
  console.log("\n── Lesson lookup ────────────────────────────────────────");

  const lessons = await supabaseGet(
    `lessons?title=eq.${encodeURIComponent("What Is an Argument")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error('Lesson "What Is an Argument" not found — run seed-logic-subject.ts first');
  }
  const lessonId = lessons[0]!.id as string;
  console.log(`  ✓ Found lesson: ${lessons[0]!.title} (${lessonId})`);

  // ── 3. Check for existing content block ───────────────────────────────────
  console.log("\n── Content block check ──────────────────────────────────");

  const existingBlocks = await supabaseGet(
    `lesson_blocks?lesson_id=eq.${lessonId}&type=eq.content&select=id`,
  );
  if (existingBlocks.length > 0) {
    console.log(`  ~ Content block already exists (${existingBlocks[0]!.id}) — skipping.`);
    console.log("\n── Done (no changes) ────────────────────────────────────\n");
    return;
  }

  // ── 4. Create content block ───────────────────────────────────────────────
  console.log("\n── Creating content block ───────────────────────────────");

  const result = await post(
    "/lessons-block",
    {
      lessonId,
      type: "content",
      data: { content: L1_1_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  ✓ Content block created (${result.data?.id})`);
  console.log(`  ✓ ${L1_1_CONTENT.length} nodes: heading, concept, paragraph, heading, steps, concept, think, recall, inline-quiz`);

  console.log(`
── Done ─────────────────────────────────────────────────

  Lesson: What Is an Argument
  Block:  ${result.data?.id}
  Nodes:  ${L1_1_CONTENT.length}

  View at: http://localhost:5173/lessons/what-is-an-argument
`);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message);
  process.exit(1);
});

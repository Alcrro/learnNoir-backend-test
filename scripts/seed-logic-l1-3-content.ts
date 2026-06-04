/**
 * Seed: L1.3 — Deductive vs Inductive (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l1-3-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock and DragSortNode are algorithm-only (array/number based).
 * - example → concept block cu secțiuni
 * - drag-sort → fill-blanks cu opțiuni "deductiv" / "inductiv"
 */

const BASE = "http://localhost:3000/api";
const SUPABASE_URL = "https://ypdfaegmuxxxiamhswgk.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZGZhZWdtdXh4eGlhbWhzd2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQzMjYyMywiZXhwIjoyMDkwMDA4NjIzfQ.6v-24nO6Pi3NP39ZDPxY7p9BIcwlkC236zvGo2n8H7s";

const SEED_EMAIL = "seed@admin.com";
const SEED_PASS  = "Seed1234!";

// ── helpers ───────────────────────────────────────────────────────────────────

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

const L1_3_CONTENT = [
  // 1. concept — Deductiv vs Inductiv
  {
    type: "concept",
    title: "Raționament deductiv vs inductiv",
    sections: [
      {
        label: "Raționament deductiv",
        text: "Pornește de la general la particular. Dacă premisele sunt adevărate și forma este validă, concluzia este în mod necesar adevărată — nu poate fi falsă. Oferă certitudine, nu probabilitate. Exemplu de formă: Toți A sunt B. X este A. Deci X este B.",
      },
      {
        label: "Raționament inductiv",
        text: "Pornește de la particular la general. Chiar dacă premisele sunt adevărate, concluzia rămâne probabilă — nu certă. Un singur contraexemplu poate invalida o concluzie inductivă. Exemplu de formă: X, Y și Z au proprietatea P. Deci probabil toți membrii grupului au proprietatea P.",
      },
      {
        label: "Când se folosește fiecare",
        text: "Deductiv: matematică, logică formală, drept (aplicarea regulii la caz). Inductiv: știință experimentală, statistică, predicții bazate pe date istorice. În LSAT și GMAT, argumentele din pasaje sunt predominant deductive — tratarea lor ca inductive duce la greșeli de interpretare.",
      },
    ],
  },

  // 2. concept — 3 argumente deductive + 3 inductive (înlocuiește example)
  {
    type: "concept",
    title: "Argumente deductive vs inductive — exemple",
    sections: [
      {
        label: "Deductiv 1",
        text: "P1: Toți mamiferele sunt vertebrate. P2: Balena este mamifer. C: Deci, balena este vertebrată. ✓ Deductiv — dacă premisele sunt adevărate, concluzia este în mod necesar adevărată. Nu există posibilitate de excepție.",
      },
      {
        label: "Deductiv 2",
        text: "P1: Dacă plouă, strada se udă. P2: Plouă. C: Deci, strada este udă. ✓ Deductiv (modus ponens) — forma garantează concluzia. Validitatea nu depinde de conținut, ci de structură.",
      },
      {
        label: "Deductiv 3",
        text: "P1: Niciun pește nu este mamifer. P2: Somonul este pește. C: Deci, somonul nu este mamifer. ✓ Deductiv — forma silogistică validă; concluzia decurge cu necesitate.",
      },
      {
        label: "Inductiv 1",
        text: "P1: Soarele a răsărit în fiecare zi din ultimii 4,5 miliarde de ani. C: Deci, soarele va răsări mâine. ✓ Inductiv — probabilitate extrem de mare, dar nu certitudine logică. Un scenariu cosmic extrem ar putea invalida concluzia.",
      },
      {
        label: "Inductiv 2",
        text: "P1: Din 1.000 de pacienți tratați cu medicamentul X, 850 s-au recuperat. C: Deci, medicamentul X este eficient pentru această boală. ✓ Inductiv — generalizare statistică. Concluzia este probabilă, nu certă; eșantionul poate fi nereprezentativ.",
      },
      {
        label: "Inductiv 3",
        text: "P1: Fiecare corb observat vreodată a fost negru. C: Deci, toți corbii sunt negri. ✓ Inductiv — inducție prin enumerare. Un singur corb alb (descoperit în Australia) a infirmat această concluzie, demonstrând limita raționamentului inductiv.",
      },
    ],
  },

  // 3. heading — De ce contează distincția
  {
    type: "heading",
    text: "De ce contează distincția",
    level: 2,
  },

  // 4. paragraph
  {
    type: "paragraph",
    text: "În LSAT și GMAT, argumentele din pasaje sunt predominant deductive — autorul prezintă premise și trage o concluzie pe care o tratează ca certă. Dacă tratezi o concluzie inductivă ca și cum ar fi certă, vei selecta răspunsuri greșite la întrebările de tip \"flaw\" și \"weaken\". Identificarea corectă a tipului de raționament este primul pas în analiza oricărui argument standardizat.",
  },

  // 5. fill-blanks — Clasifică argumentele (înlocuiește drag-sort)
  {
    type: "fill-blanks",
    title: "Clasifică argumentele: deductiv sau inductiv?",
    language: "text",
    content: "1. Toți avocații au studiat dreptul. Maria a studiat dreptul. Deci Maria este avocat.  →  {{0}}\n2. În ultimii 10 ani, companiile tech au crescut în medie cu 15% anual. Deci sectorul tech va crește și anul viitor.  →  {{1}}\n3. Dacă un număr este divizibil cu 4, atunci este par. 16 este divizibil cu 4. Deci 16 este par.  →  {{2}}\n4. Cei 500 de studenți intervievați preferă cursurile online. Deci studenții preferă cursurile online.  →  {{3}}\n5. Nicio reptilă nu este cu sânge cald. Șarpele este reptilă. Deci șarpele nu este cu sânge cald.  →  {{4}}\n6. Fiecare iarnă din ultimii 30 de ani a adus zăpadă în București. Deci și iarna aceasta va ninge în București.  →  {{5}}",
    blanks: [
      { id: 0, options: ["deductiv", "inductiv"], correct: "deductiv" },
      { id: 1, options: ["deductiv", "inductiv"], correct: "inductiv" },
      { id: 2, options: ["deductiv", "inductiv"], correct: "deductiv" },
      { id: 3, options: ["deductiv", "inductiv"], correct: "inductiv" },
      { id: 4, options: ["deductiv", "inductiv"], correct: "deductiv" },
      { id: 5, options: ["deductiv", "inductiv"], correct: "inductiv" },
    ],
  },

  // 6. recall — 3 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Care este diferența fundamentală dintre raționamentul deductiv și cel inductiv?",
        options: [
          "Deductivul are mai multe premise decât inductivul.",
          "Deductivul garantează concluzia dacă premisele sunt adevărate; inductivul oferă doar probabilitate.",
          "Inductivul este mai precis decât deductivul.",
          "Deductivul se folosește în știință; inductivul în matematică.",
        ],
        correct: 1,
      },
      {
        question: "\"Am testat 200 de eșantioane de apă din râu și toate au conținut bacterii X. Deci apa din râu conține bacterii X.\" Ce tip de raționament este acesta și care este riscul?",
        options: [
          "Deductiv — riscul este că premisa ar putea fi falsă.",
          "Inductiv — riscul este că eșantionul poate fi nereprezentativ pentru întregul râu.",
          "Deductiv — riscul este că forma silogistică este incorectă.",
          "Inductiv — nu există niciun risc dacă eșantionul este suficient de mare.",
        ],
        correct: 1,
      },
      {
        question: "Un argument deductiv valid cu premise false produce:",
        options: [
          "O concluzie falsă în mod necesar.",
          "O concluzie adevărată în mod necesar.",
          "O concluzie care poate fi adevărată sau falsă — validitatea nu garantează adevărul.",
          "Un argument care nu mai este valid.",
        ],
        correct: 2,
      },
    ],
  },
];

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
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

  console.log("\n── Lesson lookup ────────────────────────────────────────");

  const lessons = await supabaseGet(
    `lessons?title=eq.${encodeURIComponent("Deductive vs Inductive")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error('Lesson "Deductive vs Inductive" not found — run seed-logic-subject.ts first');
  }
  const lessonId = lessons[0]!.id as string;
  console.log(`  ✓ Found lesson: ${lessons[0]!.title} (${lessonId})`);

  console.log("\n── Content block check ──────────────────────────────────");

  const existingBlocks = await supabaseGet(
    `lesson_blocks?lesson_id=eq.${lessonId}&type=eq.content&select=id`,
  );
  if (existingBlocks.length > 0) {
    console.log(`  ~ Content block already exists (${existingBlocks[0]!.id}) — skipping.`);
    console.log("\n── Done (no changes) ────────────────────────────────────\n");
    return;
  }

  console.log("\n── Creating content block ───────────────────────────────");

  const result = await post(
    "/lessons-block",
    {
      lessonId,
      type: "content",
      data: { content: L1_3_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  ✓ Content block created (${result.data?.id})`);
  console.log(`  ✓ ${L1_3_CONTENT.length} nodes: concept, concept, heading, paragraph, fill-blanks, recall`);

  console.log(`
── Done ─────────────────────────────────────────────────

  Lesson: Deductive vs Inductive
  Block:  ${result.data?.id}
  Nodes:  ${L1_3_CONTENT.length}

  View at: http://localhost:5173/lessons/deductive-vs-inductive
`);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message);
  process.exit(1);
});

/**
 * Seed: L1.2 — Premises & Conclusions (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l1-2-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; "examples" use concept blocks instead.
 * FillBlanks format: {{N}} in content string, blanks: [{id, options, correct}].
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

const L1_2_CONTENT = [
  // 1. concept — Premise vs concluzii
  {
    type: "concept",
    title: "Premise și concluzii",
    sections: [
      {
        label: "Ce sunt premisele",
        text: "Premisele sunt propozițiile care oferă suport, dovezi sau motive pentru concluzie. Ele sunt punctul de plecare al raționamentului — ce acceptăm ca adevărat pentru a ajunge undeva. Cuvinte indicator de premisă: \"deoarece\", \"pentru că\", \"dat fiind că\", \"știind că\", \"din moment ce\", \"dacă\".",
      },
      {
        label: "Ce este concluzia",
        text: "Concluzia este propoziția pe care argumentul încearcă să o demonstreze sau să o susțină. Este destinația raționamentului — ce vrea autorul să acceptăm. Cuvinte indicator de concluzie: \"deci\", \"prin urmare\", \"în concluzie\", \"rezultă că\", \"de aceea\", \"astfel\".",
      },
      {
        label: "Ordinea nu contează",
        text: "Concluzia poate apărea la începutul, mijlocul sau sfârșitul unui argument. Nu te ghida după poziție — ghidează-te după funcție. Întrebarea cheie: această propoziție susține o altă propoziție (premisă) sau este susținută de celelalte (concluzie)?",
      },
      {
        label: "Cuvinte indicator — atenție",
        text: "Nu toate argumentele conțin cuvinte indicator. Și uneori același cuvânt poate introduce fie o premisă, fie o concluzie în funcție de context. Cuvintele indicator sunt indicii, nu reguli absolute — analiza funcției rămâne esențială.",
      },
    ],
  },

  // 2. concept — 4 argumente cu premise/concluzie marcate (înlocuiește example)
  {
    type: "concept",
    title: "Argumente disecate",
    sections: [
      {
        label: "Argument 1",
        text: "[P1] Exercițiul fizic regulat reduce riscul bolilor cardiovasculare. [P2] Andrei face sport de trei ori pe săptămână. [C] Deci, Andrei reduce riscul de boli cardiovasculare. — Cuvânt indicator de concluzie: \"deci\".",
      },
      {
        label: "Argument 2",
        text: "[C] Această lege ar trebui abrogată. [P1] Deoarece nu a redus rata criminalității, [P2] și a generat costuri suplimentare de 2 milioane de euro anual. — Concluzia apare prima; premisele urmează introduse de \"deoarece\".",
      },
      {
        label: "Argument 3",
        text: "[P1] Studenții care dorm cel puțin 8 ore pe noapte au performanțe academice mai bune. [P2] Maria doarme în medie 6 ore. [C] Prin urmare, Maria probabil nu performează la potențialul ei maxim. — Cuvânt indicator: \"prin urmare\".",
      },
      {
        label: "Argument 4 — fără cuvinte indicator",
        text: "[P1] Toate democrațiile moderne garantează libertatea presei. [P2] România este o democrație modernă. [C] România garantează libertatea presei. — Niciun cuvânt indicator explicit; structura se identifică prin funcție.",
      },
    ],
  },

  // 3. predict — Care propoziție e concluzia?
  {
    type: "predict",
    question: "Citește argumentul și identifică concluzia înainte să dai reveal:\n\n\"Dat fiind că produsele locale parcurg distanțe mai mici până la consumator, și din moment ce transportul pe distanțe mari generează emisii de CO₂ semnificative, cumpărarea produselor locale contribuie la reducerea amprentei de carbon.\"",
    answer: "Concluzia este: \"cumpărarea produselor locale contribuie la reducerea amprentei de carbon.\" Premisele sunt introduse de \"dat fiind că\" și \"din moment ce\". Concluzia nu are cuvânt indicator explicit, dar este propoziția susținută de celelalte două — nu susține ea nimic altceva.",
  },

  // 4. fill-blanks — Etichetează propozițiile
  {
    type: "fill-blanks",
    title: "Etichetează structura argumentului",
    language: "text",
    content: "Toți profesioniștii care comunică eficient avansează mai repede în carieră.  →  {{0}}\nIon comunică eficient.  →  {{1}}\nPrin urmare, Ion va avansa mai repede în carieră.  →  {{2}}",
    blanks: [
      { id: 0, options: ["premisă", "concluzie"], correct: "premisă" },
      { id: 1, options: ["premisă", "concluzie"], correct: "premisă" },
      { id: 2, options: ["premisă", "concluzie"], correct: "concluzie" },
    ],
  },

  // 5. recall — 4 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Care cuvânt introduce cel mai frecvent o concluzie?",
        options: ["deoarece", "dat fiind că", "prin urmare", "știind că"],
        correct: 2,
      },
      {
        question: "\"Deoarece rata șomajului a scăzut la 4% și PIB-ul a crescut cu 3%, economia merge bine.\" Care este concluzia?",
        options: [
          "Rata șomajului a scăzut la 4%.",
          "PIB-ul a crescut cu 3%.",
          "Economia merge bine.",
          "Nu există o concluzie clară.",
        ],
        correct: 2,
      },
      {
        question: "Un argument poate fi valid dacă concluzia apare la începutul propoziției?",
        options: [
          "Nu — concluzia trebuie să fie mereu ultima propoziție.",
          "Da — ordinea propozițiilor nu afectează structura logică.",
          "Depinde de cuvintele indicator folosite.",
          "Da, dar doar în argumente deductive.",
        ],
        correct: 1,
      },
      {
        question: "\"Știind că prețul petrolului a crescut cu 30% și că transportul depinde de petrol, costurile de transport vor crește.\" Câte premise are argumentul?",
        options: ["Una", "Două", "Trei", "Niciuna — este o opinie"],
        correct: 1,
      },
    ],
  },

  // 6. think — Reformulare cu concluzia prima
  {
    type: "think",
    question: "Ia argumentul: \"Deoarece exercițiul fizic îmbunătățește sănătatea, și sănătatea bună crește productivitatea, exercițiul fizic contribuie indirect la productivitate.\" Poți reformula același argument cu concluzia prima, fără să schimbi sensul?",
    reveal: "Da. \"Exercițiul fizic contribuie indirect la productivitate, deoarece îmbunătățește sănătatea, iar sănătatea bună crește productivitatea.\" Conținutul logic este identic — premisele susțin aceeași concluzie. Aceasta demonstrează că structura unui argument este independentă de ordinea propozițiilor în text.",
  },
];

// ── main ──────────────────────────────────────────────────────────────────────

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
    `lessons?title=eq.${encodeURIComponent("Premises & Conclusions")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error('Lesson "Premises & Conclusions" not found — run seed-logic-subject.ts first');
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
      data: { content: L1_2_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  ✓ Content block created (${result.data?.id})`);
  console.log(`  ✓ ${L1_2_CONTENT.length} nodes: concept, concept, predict, fill-blanks, recall, think`);

  console.log(`
── Done ─────────────────────────────────────────────────

  Lesson: Premises & Conclusions
  Block:  ${result.data?.id}
  Nodes:  ${L1_2_CONTENT.length}

  View at: http://localhost:5173/lessons/premises-and-conclusions
`);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message);
  process.exit(1);
});

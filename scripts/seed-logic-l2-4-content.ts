/**
 * Seed: L2.4 — Deductive Puzzles (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l2-4-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; puzzles use concept block.
 * No typographic quotes inside string literals (esbuild parsing issue).
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
    console.error(`POST ${path} -> ${res.status}`, json);
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

const L2_4_CONTENT = [
  // 1. paragraph — Intro disciplina
  {
    type: "paragraph",
    text: "Puzzle-urile deductive sunt exercitii de disciplina mentala: fiecare pas trebuie justificat din informatii date, fara nicio ghicire sau intuitie. Spre deosebire de grilele logice, puzzle-urile deductive nu au o grila vizuala -- tot raționamentul se desfasoara prin eliminarea cazurilor imposibile si identificarea singurei configuratii consistente cu toate conditiile. Doua dintre cele mai importante familii de puzzle-uri: Einstein's Riddle (variante simplificate) si Knights and Knaves.",
  },

  // 2. concept — 2 puzzle-uri clasice rezolvate (inlocuieste example)
  {
    type: "concept",
    title: "Doua puzzle-uri clasice rezolvate",
    sections: [
      {
        label: "Puzzle 1: Einstein's Riddle simplificat",
        text: "Setup: 3 case (Rosie, Albastra, Verde), 3 proprietari (Ana, Bogdan, Carmen), 3 animale de companie (caine, pisica, papagal). Conditii: (C1) Ana locuieste in casa rosie. (C2) Proprietarul casei albastre are un caine. (C3) Bogdan nu are o pisica. (C4) Persoana din casa verde are un papagal. (C5) Carmen nu locuieste in casa albastra.",
      },
      {
        label: "Rezolvare Puzzle 1",
        text: "C1: Ana = casa rosie (direct). C5: Carmen != albastra. Casa rosie = Ana, deci Carmen alege intre albastra si verde; nu albastra -> Carmen = verde. Bogdan = albastra (singura ramasa). C2: Bogdan (albastra) = caine. C4: Carmen (verde) = papagal. Ana = pisica (singura ramasa). Verificare C3: Bogdan != pisica (Bogdan = caine) -- consistent. Solutie: Ana=rosie+pisica | Bogdan=albastra+caine | Carmen=verde+papagal.",
      },
      {
        label: "Puzzle 2: Knights and Knaves -- intro",
        text: "Pe o insula traiesc cavaleri (knights) care spun MEREU adevarul si sclavi (knaves) care mint MEREU. Nu exista termen mediu. Intalnesti doua persoane, A si B. A spune: \"Cel putin unul dintre noi este sclav.\" Ce este A -- cavaler sau sclav?",
      },
      {
        label: "Rezolvare Puzzle 2",
        text: "Cazul 1: A = cavaler (spune adevarul). Atunci \"cel putin unul e sclav\" este adevarat. A e cavaler, deci B e sclav -- consistent. Cazul 2: A = sclav (minte). Atunci \"cel putin unul e sclav\" este o minciuna, deci nimeni nu e sclav. Dar A este sclav -- contradictie. Cazul 2 este imposibil. Concluzie: A este cavaler, B este sclav. Metoda: ipoteza + contradictie, nu ghicit.",
      },
    ],
  },

  // 3. think — Puzzle Knights and Knaves avansat
  {
    type: "think",
    question: "Rezolva: A spune ca B minte. B spune ca amandoi mint. Cine spune adevarul?",
    reveal: "Cazul 1: A = cavaler. Atunci \"B minte\" e adevarat -> B = sclav. B spune \"amandoi mintim\" -- B minte -- deci afirmatia e falsa -- cel putin unul nu minte -- A nu minte -- consistent cu A = cavaler. Cazul 2: A = sclav. Atunci \"B minte\" e fals -> B = cavaler. B spune \"amandoi mintim\" -- B spune adevarul -- deci e adevarat ca amandoi mint -- dar B e cavaler si nu minte -- contradictie. Concluzie: A este cavaler (spune adevarul), B este sclav (minte).",
  },

  // 4. recall — 3 MCQ pe puzzle-urile din lectie
  {
    type: "recall",
    questions: [
      {
        question: "In Puzzle 1 (Einstein simplificat), cum a fost determinat animalul Anei?",
        options: [
          "Direct dintr-o conditie care spunea ca Ana are pisica.",
          "Prin eliminare: cainele = Bogdan (C2), papagalul = Carmen (C4), deci pisica = Ana.",
          "Din conditia C3 care spunea ca Bogdan nu are pisica, deci Ana are pisica.",
          "Nu a fost determinat direct -- exista doua solutii posibile.",
        ],
        correct: 1,
      },
      {
        question: "De ce metoda \"ipoteza + contradictie\" este esentiala in Knights and Knaves?",
        options: [
          "Pentru ca nu exista alta metoda -- grilele nu functioneaza pentru acest tip de puzzle.",
          "Pentru ca ipotezele false produc contradictii logice, eliminand cazurile imposibile si lasand solutia unica.",
          "Pentru ca ghicitul este interzis, deci trebuie sa incerci ambele variante si sa alegi la intamplare.",
          "Nu este esentiala -- poti rezolva orice puzzle Knights and Knaves din prima incercare.",
        ],
        correct: 1,
      },
      {
        question: "In Puzzle 2, daca A ar spune: \"Suntem amandoi cavaleri\" -- ce ar fi A?",
        options: [
          "Cavaler -- pentru ca afirmatia poate fi adevarata.",
          "Sclav -- un cavaler nu ar face o afirmatie care sa poata fi falsa.",
          "Imposibil de determinat fara informatii despre B.",
          "Sclav -- daca A = cavaler, afirmatia e adevarata si B = cavaler, consistent; daca A = sclav, afirmatia e falsa, deci nu amandoi sunt cavaleri, B = sclav, consistent. Ambele cazuri sunt posibile.",
        ],
        correct: 3,
      },
    ],
  },
];

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n-- Auth -------------------------------------------------");

  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: SEED_EMAIL, password: SEED_PASS }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
  await loginRes.json();
  const rawCookies = loginRes.headers.getSetCookie?.() ?? [];
  const cookieHeader = rawCookies.map((c) => c.split(";")[0]).join("; ");
  console.log("  checkmark Logged in");

  console.log("\n-- Lesson lookup ----------------------------------------");

  const lessons = await supabaseGet(
    `lessons?title=eq.${encodeURIComponent("Deductive Puzzles")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Deductive Puzzles\" not found -- run seed-logic-subject.ts first");
  }
  const lessonId = lessons[0]!.id as string;
  console.log(`  checkmark Found lesson: ${lessons[0]!.title} (${lessonId})`);

  console.log("\n-- Content block check ----------------------------------");

  const existingBlocks = await supabaseGet(
    `lesson_blocks?lesson_id=eq.${lessonId}&type=eq.content&select=id`,
  );
  if (existingBlocks.length > 0) {
    console.log(`  ~ Content block already exists (${existingBlocks[0]!.id}) -- skipping.`);
    console.log("\n-- Done (no changes) ------------------------------------\n");
    return;
  }

  console.log("\n-- Creating content block -------------------------------");

  const result = await post(
    "/lessons-block",
    {
      lessonId,
      type: "content",
      data: { content: L2_4_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L2_4_CONTENT.length} nodes: paragraph, concept (2 puzzle-uri rezolvate), think, recall (3 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Deductive Puzzles
  Block:  ${result.data?.id}
  Nodes:  ${L2_4_CONTENT.length}

  View at: http://localhost:5173/lessons/deductive-puzzles
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

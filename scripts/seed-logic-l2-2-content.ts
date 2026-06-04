/**
 * Seed: L2.2 — Logic Grids Intermediate (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l2-2-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Grid 4x4: Radu, Sara, Tudor, Vera x Cluj, Iasi, Pitesti, Sibiu
 * Solution: Radu=Pitesti, Sara=Cluj, Tudor=Sibiu, Vera=Iasi
 *
 * Note: ExampleBlock is algorithm-only; grid walkthrough uses concept block.
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

const L2_2_CONTENT = [
  // 1. paragraph — Recap si introducere grile mai complexe
  {
    type: "paragraph",
    text: "La grila 3x3, fiecare deducere bloca rapid optiunile. Grilele 4x4 introduc doua noi dificultati: conditii negative combinate (multiple celule excluse simultan) si conditii relative (daca X atunci Y), care nu dau informatii directe ci elimina cazuri prin contradictie. Metoda ramane aceeasi -- citesti toate conditiile, marchezi ce e sigur, elimini prin deductie -- dar ordinea in care aplici conditiile devine cruciala.",
  },

  // 2. concept — Grid 4x4 rezolvat integral pas cu pas (inlocuieste example)
  {
    type: "concept",
    title: "Exemplu rezolvat: Grid 4x4 cu conditii negative si relative",
    sections: [
      {
        label: "Setup",
        text: "Persoane: Radu, Sara, Tudor, Vera. Orase natale: Cluj, Iasi, Pitesti, Sibiu. Conditii: (C1) Radu nu este din Cluj. (C2) Sara nu este din Iasi. (C3) Tudor este din Pitesti sau Sibiu. (C4) Daca Vera este din Cluj, atunci Radu este din Pitesti. (C5) Sara nu este din Pitesti. (C6) Tudor nu este din Pitesti. (C7) Vera nu este din Pitesti.",
      },
      {
        label: "Pasul 1 -- Aplica C6",
        text: "C6: Tudor != Pitesti. Marchezi X in (Tudor, Pitesti). C3 spune Tudor apartine {Pitesti, Sibiu}. Dupa C6, Tudor nu poate fi Pitesti. Deci Tudor = Sibiu. Marchezi checkmark in (Tudor, Sibiu) si X in restul coloanei Sibiu: (Radu, Sibiu)=X, (Sara, Sibiu)=X, (Vera, Sibiu)=X.",
      },
      {
        label: "Pasul 2 -- Aplica C2 si C5",
        text: "C2: Sara != Iasi. C5: Sara != Pitesti. Sara are deja X pe Sibiu (de la pasul 1). Deci Sara apartine {Cluj, Sibiu, Iasi, Pitesti} minus {Sibiu, Iasi, Pitesti} = {Cluj}. Sara = Cluj. Marchezi checkmark in (Sara, Cluj) si X in restul coloanei Cluj: (Radu, Cluj)=X (consistent cu C1), (Tudor, Cluj)=X (deja rezolvat), (Vera, Cluj)=X.",
      },
      {
        label: "Pasul 3 -- Evalueaza C4",
        text: "C4: daca Vera = Cluj atunci Radu = Pitesti. Vera != Cluj (marcat la pasul 2). Antecedentul conditiei este fals -- conditia nu se activeaza. C4 nu ofera informatii suplimentare in aceasta configuratie. Aceasta este comportamentul tipic al conditiilor relative: uneori elimina cazuri, alteori raman inactive.",
      },
      {
        label: "Pasul 4 -- Aplica C7 si finalizeaza",
        text: "C7: Vera != Pitesti. Vera are X pe Cluj si Sibiu (pasii anteriori). Deci Vera apartine {Iasi, Pitesti} minus {Pitesti} = {Iasi}. Vera = Iasi. Marchezi checkmark in (Vera, Iasi) si X in (Radu, Iasi). Radu are X pe Cluj, Sibiu, Iasi. Deci Radu = Pitesti.",
      },
      {
        label: "Solutie finala",
        text: "Radu = Pitesti | Sara = Cluj | Tudor = Sibiu | Vera = Iasi. Verificare: toate cele 7 conditii sunt satisfacute. Nota: C4 (conditia relativa) nu a fost folosita direct -- a ramas inactiva deoarece antecedentul sau (Vera=Cluj) a fost eliminat mai devreme. Aceasta se intampla frecvent in grile reale.",
      },
    ],
  },

  // 3. think
  {
    type: "think",
    question: "La ce pas ai fi blocat daca nu aplici C6 inainte de C3? Ce strategie alternativa ai folosi pentru a determina orasul lui Tudor?",
    reveal: "Daca aplici C3 singura (Tudor apartine {Pitesti, Sibiu}), nu poti decide intre Pitesti si Sibiu. Ai fi blocat pana cand alta conditie elimina una din optiuni. Strategia alternativa: aplica C6 imediat -- Tudor != Pitesti -- care, combinata cu C3, da Tudor = Sibiu. Lectia: cauta mereu conditia care, combinata cu alta deja aplicata, da o deductie completa. Nu aplica conditii in ordinea in care sunt scrise, ci in ordinea care produce deductii.",
  },

  // 4. recall -- 4 MCQ pe grila rezolvata
  {
    type: "recall",
    questions: [
      {
        question: "In grila din exemplu, de ce conditia C4 (daca Vera=Cluj atunci Radu=Pitesti) nu a fost folosita direct in rezolvare?",
        options: [
          "C4 era redundanta -- Radu=Pitesti fusese deja demonstrat din alte conditii.",
          "Antecedentul lui C4 (Vera=Cluj) a fost eliminat la pasul 2, deci C4 nu s-a activat.",
          "C4 este o conditie incorecta -- contrazice celelalte conditii.",
          "C4 a fost folosita la pasul 3 pentru a marca Radu=Pitesti.",
        ],
        correct: 1,
      },
      {
        question: "Intr-o grila 4x4, o conditie relativa de tipul \"Daca X=A atunci Y=B\" este utila atunci cand:",
        options: [
          "Stii deja ca X=A, deci poti concluziona Y=B.",
          "Stii deja ca Y!=B, deci poti concluziona X!=A (contrareciproca).",
          "Ambele situatii de mai sus.",
          "Conditiile relative nu sunt utile -- genereaza doar incertitudine.",
        ],
        correct: 2,
      },
      {
        question: "Sara a fost determinata = Cluj prin combinarea conditiilor C2, C5 si eliminarea Sibiu (de la Tudor). Cate conditii au contribuit la aceasta deductie?",
        options: [
          "Una -- C2 singura a fost suficienta.",
          "Doua -- C2 si C5.",
          "Trei -- C2, C5 si deductia Tudor=Sibiu care a eliminat Sibiu din optiunile Sarei.",
          "Patru -- toate conditiile au contribuit indirect.",
        ],
        correct: 2,
      },
      {
        question: "In general, de ce grilele 4x4 sunt mai dificile decat cele 3x3?",
        options: [
          "Au mai multe conditii, deci mai multe informatii -- ar trebui sa fie mai usoare.",
          "Fiecare deductie depinde de mai multe conditii combinate si de mai putine eliminari directe.",
          "Nu sunt mai dificile -- metodologia este identica si complexitatea nu creste.",
          "Grilele 4x4 au intotdeauna mai putine solutii, deci sunt mai simple de verificat.",
        ],
        correct: 1,
      },
    ],
  },

  // 5. predict -- Conditie noua adaugata la grila cunoscuta
  {
    type: "predict",
    question: "Considera grila din exemplu cu solutia originala: Radu=Pitesti, Sara=Cluj, Tudor=Sibiu, Vera=Iasi. Acum adauga conditia noua: C8 -- Vera nu este din Iasi. Cum se schimba solutia? Gandeste-te inainte sa citesti raspunsul.",
    answer: "C8 elimina Vera=Iasi. Vera ramane cu {Pitesti} (Cluj=Sara, Sibiu=Tudor, Iasi eliminat de C8). Vera = Pitesti -- dar aceasta contrazice C7 (Vera != Pitesti)! Grila devine inconsistenta: nu exista solutie valida daca adaugam C8. Aceasta demonstreaza ca adaugarea unei conditii noi poate fie sa schimbe solutia, fie sa faca puzzle-ul insolubil -- o proprietate importanta a grilelor logice.",
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
    `lessons?title=eq.${encodeURIComponent("Logic Grids — Intermediate")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Logic Grids -- Intermediate\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L2_2_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L2_2_CONTENT.length} nodes: paragraph, concept (grid 4x4 walkthrough), think, recall (4 MCQ), predict`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Logic Grids -- Intermediate
  Block:  ${result.data?.id}
  Nodes:  ${L2_2_CONTENT.length}

  View at: http://localhost:5173/lessons/logic-grids-intermediate
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

/**
 * Seed: L4.3 — Evaluate the Argument (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l4-3-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; GMAT passages use concept block.
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

const L4_3_CONTENT = [
  // 1. concept -- Ce cer evaluate questions
  {
    type: "concept",
    title: "Evaluate the Argument -- ce cer si cum se deosebesc de strengthen/weaken",
    sections: [
      {
        label: "Diferenta fata de strengthen/weaken",
        text: "La strengthen/weaken questions, alegi o afirmatie care SE STIE ca e adevarata si care intareste sau slabeste argumentul. La evaluate questions, alegi o INTREBARE al carei raspuns ar fi cel mai util pentru a evalua daca argumentul e solid. Raspunsul la acea intrebare poate merge in ambele directii -- poate confirma sau infirma argumentul. Stem-ul tipic: \"Which of the following would be most useful to know in evaluating the argument?\" sau \"The answer to which of the following questions would be most helpful in assessing the validity of the argument?\"",
      },
      {
        label: "Ce informatie ar fi 'cea mai utila' pentru a evalua",
        text: "Informatia cea mai utila atinge PRESUPUNEREA CENTRALA a argumentului -- gap-ul logic care face diferenta intre premise si concluzie. Daca stim ca presupunerea e adevarata, argumentul se intareste; daca e falsa, argumentul se slabeste. Aceasta bidirectionalitate e testul decisiv: o varianta e corecta la evaluate questions daca si numai daca cunoasterea raspunsului ar putea ATATA intari CAT SI slabi argumentul, in functie de ce anume afla. Variantele care afecteaza argumentul doar intr-o singura directie (doar strengthening sau doar weakening) sunt de obicei incorecte.",
      },
      {
        label: "Strategia",
        text: "Pasul 1: Identifica concluzia si premisele. Pasul 2: Identifica presupunerea centrala -- ce trebuie sa fie adevarat pentru ca argumentul sa tina. Pasul 3: Formuleaza o intrebare in jurul acelei presupuneri: \"Oare [presupunerea] este adevarata in acest caz?\" Pasul 4: Cauta varianta care pune exact acea intrebare. Testul bidirectionalitatii: aplica \"daca da\" si \"daca nu\" la fiecare varianta -- daca ambele raspunsuri schimba forta argumentului in directii opuse, varianta e corecta.",
      },
    ],
  },

  // 2. concept -- 2 argumente GMAT cu evaluate questions (inlocuieste example)
  {
    type: "concept",
    title: "2 argumente GMAT -- analiza evaluate questions",
    sections: [
      {
        label: "Argumentul 1 si intrebarea",
        text: "Pasaj: \"Compania de retail XYZ a deschis 10 noi magazine in ultimul an. In aceeasi perioada, vanzarile totale ale companiei au crescut cu 20%. Prin urmare, deschiderea de noi magazine a condus la cresterea vanzarilor.\" Stem: \"Care dintre urmatoarele ar fi cel mai util de stiut pentru a evalua argumentul?\"",
      },
      {
        label: "Analiza variantelor pentru Argumentul 1",
        text: "Presupunerea centrala: cresterea vanzarilor a fost cauzata de noile magazine, nu de alti factori. Intrebarea utila: \"Au crescut vanzarile magazinelor existente in aceeasi perioada?\" -- daca da: poate cresterea vine din alte surse, nu din noile magazine (slabeste); daca nu: noile magazine par a fi principala sursa (intareste). Testul bidirectionalitatii: da/nu duc la concluzii opuse -- varianta corecta. INCORECTE: \"Cat a costat deschiderea fiecarui magazin?\" (irelevant pentru cauzalitate); \"In ce orase s-au deschis magazinele?\" (nu testeaza presupunerea centrala).",
      },
      {
        label: "Argumentul 2 si intrebarea",
        text: "Pasaj: \"Studentii care au participat la seminarul de scriere academica au obtinut note mai mari la lucrarile de licenta decat cei care nu au participat. Prin urmare, seminarul imbunatateste calitatea lucrarilor de licenta.\" Stem: \"Care ar fi cel mai util de stiut pentru a evalua concluzia?\"",
      },
      {
        label: "Analiza variantelor pentru Argumentul 2",
        text: "Presupunerea centrala: diferenta de note provine din seminar, nu din faptul ca studentii mai motivati/mai capabili sunt si cei care aleg sa participe la seminar (selection bias). Intrebarea utila: \"Erau studentii care au participat la seminar deja mai buni la scriere inainte de seminar?\" -- daca da: diferenta reflecta selectie, nu efectul seminarului (slabeste); daca nu: diferenta poate fi atribuita seminarului (intareste). INCORECTE: \"Cate ore dureaza seminarul?\" (nu testeaza presupunerea cheie); \"Ce teme au abordat lucrarile de licenta?\" (irelevant).",
      },
    ],
  },

  // 3. think -- Ce intrebare ai pune?
  {
    type: "think",
    question: "Citeste argumentul si formuleaza o intrebare al carei raspuns ar fi cel mai util pentru a-l evalua:\n\n\"Angajatii care au beneficiat de coaching executiv au obtinut promovari mai rapid decat colegii lor. Prin urmare, programul de coaching executiv accelereaza carierele angajatilor.\"\n\nCe intrebare ai pune?",
  },

  // 4. recall -- 3 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Care este testul decisiv pentru a verifica daca o varianta e corecta la o evaluate question?",
        options: [
          "Varianta trebuie sa intareasca argumentul -- evaluate questions cauta dovezi pro.",
          "Varianta trebuie sa fie o intrebare al carei raspuns, indiferent de directie (da sau nu), afecteaza forta argumentului in moduri opuse.",
          "Varianta trebuie sa fie o intrebare despre sursa sau calitatea dovezilor.",
          "Varianta trebuie sa slabeasca argumentul -- evaluate questions cauta puncte vulnerabile.",
        ],
        correct: 1,
      },
      {
        question: "Argument: \"Orasele cu mai multi politisti per capita au rate mai mici ale criminalitatii. Deci, angajarea mai multor politisti reduce criminalitatea.\" Care intrebare ar fi cea mai utila pentru a evalua argumentul?",
        options: [
          "Care este salariul mediu al unui politist?",
          "In ce orase s-a masurat rata criminalitatii?",
          "Orasele cu mai multi politisti au adoptat si alte masuri anti-crima in acelasi timp?",
          "Cat de vechi sunt datele despre criminalitate?",
        ],
        correct: 2,
      },
      {
        question: "De ce variantele care afecteaza argumentul DOAR intr-o directie (doar strengthening sau doar weakening) sunt de obicei incorecte la evaluate questions?",
        options: [
          "Deoarece la evaluate questions raspunsul la intrebare nu trebuie sa fie relevant.",
          "Deoarece evaluate questions cer o informatie neutra -- fara impact asupra argumentului.",
          "Deoarece la evaluate questions cauti o intrebare al carei raspuns ar putea merge in oricare directie; o varianta unidirectionala e mai potrivita pentru strengthen/weaken.",
          "Deoarece evaluate questions se aplica doar argumentelor corecte logic.",
        ],
        correct: 2,
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
    `lessons?title=eq.${encodeURIComponent("Evaluate the Argument")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Evaluate the Argument\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L4_3_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L4_3_CONTENT.length} nodes: concept, concept (2 argumente GMAT), think, recall (3 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Evaluate the Argument
  Block:  ${result.data?.id}
  Nodes:  ${L4_3_CONTENT.length}

  View at: http://localhost:5173/lessons/evaluate-the-argument
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

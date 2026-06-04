/**
 * Seed: L2.3 — Syllogisms (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l2-3-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; syllogism examples use concept block.
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

const L2_3_CONTENT = [
  // 1. concept — Ce este un silogism
  {
    type: "concept",
    title: "Ce este un silogism",
    sections: [
      {
        label: "Structura clasica",
        text: "Un silogism este un argument deductiv cu doua premise si o concluzie. Premisa majora: propozitia generala care stabileste o regula sau o relatie intre categorii. Premisa minora: propozitia particulara care incadreaza un subiect specific intr-o categorie. Concluzia: rezultatul logic care decurge cu necesitate din cele doua premise.",
      },
      {
        label: "Tipuri de silogisme",
        text: "Silogism categoric: foloseste relatii de tipul \"toti\", \"niciun\", \"unii\". Exemplu: Toti A sunt B; X este A; deci X este B. Silogism ipotetic (conditii): structura daca P atunci Q. Daca P; deci Q. Silogism disjunctiv: structura P sau Q; nu P; deci Q. In LSAT si GMAT apar frecvent silogisme categorice si ipotetice.",
      },
      {
        label: "Cum verifici validitatea",
        text: "Validitatea depinde de forma, nu de continut. Intrebarea nu este \"sunt premisele adevarate?\" ci \"daca premisele ar fi adevarate, concluzia ar urma in mod necesar?\". Metoda rapida: abstractizeaza silogismul (inlocuieste termenii cu A, B, X) si testeaza forma. Daca forma este valida, orice continut specific care respecta forma produce un argument valid.",
      },
    ],
  },

  // 2. concept — 5 silogisme: 3 valide + 2 invalide (inlocuieste example)
  {
    type: "concept",
    title: "5 silogisme analizate: 3 valide si 2 invalide",
    sections: [
      {
        label: "Valid 1 -- Modus Ponens",
        text: "P1 (majora): Toti matematicienii gandesc abstract. P2 (minora): Ana este matematiciana. C: Deci, Ana gandeste abstract. Forma: Toti A sunt B; X este A; deci X este B. Diagrama Venn: cercul \"matematicieni\" este complet inclus in cercul \"gandesc abstract\"; Ana este un punct in cercul \"matematicieni\" -- deci obligatoriu si in cercul \"gandesc abstract\".",
      },
      {
        label: "Valid 2 -- Modus Tollens",
        text: "P1: Daca un animal este mamifer, atunci are sange cald. P2: Soparla nu are sange cald. C: Deci, soparla nu este mamifer. Forma: Daca P atunci Q; nu Q; deci nu P. Aceasta este contrareciproca si este intotdeauna valida. Eroarea frecventa: confundarea cu \"nu P, deci nu Q\" -- care este invalida.",
      },
      {
        label: "Valid 3 -- Silogism disjunctiv",
        text: "P1: Fie Bogdan este la birou, fie este acasa. P2: Bogdan nu este la birou. C: Deci, Bogdan este acasa. Forma: P sau Q; nu P; deci Q. Valid daca disjunctia este exhaustiva (nu exista a treia optiune). Daca exista optiuni nelistate (de ex. Bogdan ar putea fi in vacanta), concluzia nu mai este garantata.",
      },
      {
        label: "Invalid 1 -- Afirmarea consecventului",
        text: "P1: Daca ploua, strada e uda. P2: Strada e uda. C (INCORECTA): Deci, ploua. Forma invalida: Daca P atunci Q; Q; deci P. Eroarea: strada poate fi uda din alte motive (furtun, spalat). Q poate fi adevarat fara ca P sa fie adevarat. Aceasta este una din cele mai frecvente erori in argumentele LSAT.",
      },
      {
        label: "Invalid 2 -- Negarea antecedentului",
        text: "P1: Daca inveti, vei promova. P2: Nu inveti. C (INCORECTA): Deci, nu vei promova. Forma invalida: Daca P atunci Q; nu P; deci nu Q. Eroarea: poti promova si pe alte cai (talent nativ, ghicit, copiat). Negarea antecedentului nu garanteaza negarea consecventului.",
      },
    ],
  },

  // 3. heading — Capcanele frecvente
  {
    type: "heading",
    text: "Capcanele frecvente",
    level: 2,
  },

  // 4. steps — 3 reguli cheie
  {
    type: "steps",
    steps: [
      {
        title: "Verifica forma, nu continutul",
        content: [
          {
            type: "paragraph",
            text: "Un silogism cu premise false poate fi valid. Exemplu: \"Toti pestii zboara; somonul este peste; deci somonul zboara\" -- forma valida, premise false, concluzie falsa. Validitatea si adevarul sunt proprietati distincte. In analiza LSAT, intrebarea este mereu despre validitate (forma), nu despre adevarul premiselor.",
          },
        ],
      },
      {
        title: "Un silogism poate fi valid dar sa produca concluzii false",
        content: [
          {
            type: "paragraph",
            text: "Daca forma este valida dar cel putin o premisa este falsa, concluzia poate fi falsa. Argumentul este totusi valid -- defectul este in continut, nu in structura. In LSAT, cand o intrebare cere sa \"slabesti\" argumentul, ataci premisele, nu forma silogistica.",
          },
        ],
      },
      {
        title: "Un silogism poate suna adevarat dar sa fie invalid",
        content: [
          {
            type: "paragraph",
            text: "\"Athletii fac sport; Ion face sport; deci Ion este atlet\" suna rezonabil dar forma este invalida (afirmarea consecventului). Nu te lasa convins de plauzibilitatea continutului -- abstractizeaza intotdeauna la forma si testeaza-o independent de continut.",
          },
        ],
      },
    ],
  },

  // 5. recall — 5 MCQ: valid sau invalid?
  {
    type: "recall",
    questions: [
      {
        question: "\"Toti avocatii au studiat dreptul. Carmen a studiat dreptul. Deci Carmen este avocat.\" Acest silogism este:",
        options: [
          "Valid -- forma este corecta.",
          "Invalid -- afirmarea consecventului (a studiat drept nu inseamna automat avocat).",
          "Valid dar cu premise false.",
          "Invalid -- concluzia contrazice premisa majora.",
        ],
        correct: 1,
      },
      {
        question: "\"Daca un produs este organic, atunci este mai scump. Acest produs nu este organic. Deci nu este mai scump.\" Acest silogism este:",
        options: [
          "Valid -- modus tollens.",
          "Invalid -- negarea antecedentului.",
          "Valid -- silogism disjunctiv.",
          "Invalid -- afirmarea consecventului.",
        ],
        correct: 1,
      },
      {
        question: "\"Niciun reptil nu este mamifer. Crocodilul este reptil. Deci crocodilul nu este mamifer.\" Acest silogism este:",
        options: [
          "Invalid -- concluzia nu decurge din premise.",
          "Valid -- forma categorica negativa este corecta.",
          "Invalid -- premisa majora este falsa.",
          "Valid dar concluzia este falsa.",
        ],
        correct: 1,
      },
      {
        question: "\"Daca studiezi mult, obtii note mari. Dan obtine note mari. Deci Dan studiaza mult.\" Ce eroare logica contine?",
        options: [
          "Negarea antecedentului.",
          "Afirmarea consecventului.",
          "Modus tollens incorect aplicat.",
          "Nu contine o eroare -- silogismul este valid.",
        ],
        correct: 1,
      },
      {
        question: "Ce proprietate face un silogism valid, indiferent de continut?",
        options: [
          "Premisele sunt adevarate in lumea reala.",
          "Concluzia pare plauzibila si rezonabila.",
          "Concluzia decurge cu necesitate din premise, daca acestea ar fi adevarate.",
          "Silogismul are exact doua premise si o concluzie.",
        ],
        correct: 2,
      },
    ],
  },

  // 6. fill-blanks — 3 silogisme incomplete, completeaza concluzia
  {
    type: "fill-blanks",
    title: "Completeaza concluzia corecta",
    language: "text",
    content: "P1: Toti filosofii iubesc intelepciunea. P2: Socrate este filosof.\nC: Deci, {{0}}\n\nP1: Nicio pasare nu este mamifer. P2: Pinguinul este pasare.\nC: Deci, {{1}}\n\nP1: Daca Maria invata zilnic, va promova examenul. P2: Maria invata zilnic.\nC: Deci, {{2}}",
    blanks: [
      {
        id: 0,
        options: [
          "Socrate iubeste intelepciunea.",
          "Socrate este intelept.",
          "Toti inteleptii sunt filosofi.",
        ],
        correct: "Socrate iubeste intelepciunea.",
      },
      {
        id: 1,
        options: [
          "Pinguinul este mamifer.",
          "Pinguinul nu este mamifer.",
          "Nicio pasare nu este pinguin.",
        ],
        correct: "Pinguinul nu este mamifer.",
      },
      {
        id: 2,
        options: [
          "Maria va promova examenul.",
          "Daca promovezi, ai invatat zilnic.",
          "Maria invata mai mult decat ceilalti.",
        ],
        correct: "Maria va promova examenul.",
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
    `lessons?title=eq.${encodeURIComponent("Syllogisms")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Syllogisms\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L2_3_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L2_3_CONTENT.length} nodes: concept, concept (5 silogisme), heading, steps (3), recall (5 MCQ), fill-blanks`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Syllogisms
  Block:  ${result.data?.id}
  Nodes:  ${L2_3_CONTENT.length}

  View at: http://localhost:5173/lessons/syllogisms
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

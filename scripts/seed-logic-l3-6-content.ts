/**
 * Seed: L3.6 — Parallel Reasoning (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l3-6-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; parallel reasoning examples use concept block.
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

const L3_6_CONTENT = [
  // 1. concept -- Ce inseamna structuri paralele
  {
    type: "concept",
    title: "Parallel Reasoning -- ce inseamna structuri paralele",
    sections: [
      {
        label: "Forma logica abstracta",
        text: "Doua argumente sunt paralele daca au aceeasi forma logica, indiferent de continut. Forma se obtine inlocuind toti termenii concreți cu variabile abstracte (A, B, C, P, Q). Exemplu: \"Toti medicii au studii superioare; Ana este medic; deci Ana are studii superioare\" si \"Toate masinile electrice au baterie; Tesla este masina electrica; deci Tesla are baterie\" au aceeasi forma: Toti A sunt B; X este A; deci X este B.",
      },
      {
        label: "Cum extragi forma dintr-un argument",
        text: "Pasul 1: Identifica premisele si concluzia. Pasul 2: Inlocuieste fiecare categorie / propozitie cu o litera (A, B, C sau P, Q). Pasul 3: Noteaza forma: \"Toti A sunt B. X este A. Deci X este B.\" sau \"Daca P atunci Q. P. Deci Q.\" Pasul 4: Verifica daca forma reflecta corect relatiile din argument -- cantificatorii (toti, unii, niciun), directia conditionalului, tipul de negatie.",
      },
      {
        label: "Cum potrivesti forma",
        text: "Dupa ce ai extras forma argumentului original, testezi fiecare varianta: abstractizeaza-o si compara cu forma originala. Continutul nu conteaza deloc -- un argument despre pinguini poate fi paralel cu unul despre contracte de munca daca au aceeasi structura logica. Diferentele subtile care rup paralelismul: \"unii\" in loc de \"toti\", directia gresita a unui conditional, o negatie lipsa sau adaugata.",
      },
    ],
  },

  // 2. concept -- 2 argumente originale cu variante analizate (inlocuieste example)
  {
    type: "concept",
    title: "2 argumente cu forma extrasa -- analiza variantelor",
    sections: [
      {
        label: "Argument original 1 si forma sa",
        text: "Argument: \"Toti angajatii care au urmat training-ul de securitate au trecut testul de certificare. Mihai a urmat training-ul de securitate. Deci, Mihai a trecut testul de certificare.\" Forma abstracta: Toti A sunt B. X este A. Deci X este B. (Modus ponens categoric cu cuantificator universal.)",
      },
      {
        label: "Analiza variantelor pentru Argumentul 1",
        text: "PARALELA: \"Toate vehiculele inspectate tehnic au primit certificat de conformitate. Masina lui Radu a fost inspectata. Deci Masina lui Radu a primit certificat.\" -- Toti A sunt B; X este A; deci X este B. Forma identica. NU PARALELA: \"Unii studenti care au promovat au beneficiat de meditatie. Ana a beneficiat de meditatie. Deci Ana a promovat.\" -- doua diferente: \"unii\" in loc de \"toti\" si afirmarea consecventului in loc de modus ponens. NU PARALELA: \"Toti managerii certificati au absolvit un curs. Directorul nu a absolvit. Deci directorul nu e manager certificat.\" -- forma este modus tollens (Toti A sunt B; X nu este B; deci X nu este A), nu modus ponens -- structura diferita.",
      },
      {
        label: "Argument original 2 si forma sa",
        text: "Argument: \"Fie proiectul este livrat la termen, fie clientul va solicita penalitati. Proiectul nu a fost livrat la termen. Deci clientul va solicita penalitati.\" Forma abstracta: P sau Q. Nu P. Deci Q. (Silogism disjunctiv.)",
      },
      {
        label: "Analiza variantelor pentru Argumentul 2",
        text: "PARALELA: \"Fie angajatul respecta politica de confidentialitate, fie contractul va fi reziliat. Angajatul nu a respectat politica. Deci contractul va fi reziliat.\" -- P sau Q; Nu P; Deci Q. Forma identica, continut complet diferit. NU PARALELA: \"Fie examenul este luat, fie studentul repeta anul. Studentul a luat examenul. Deci studentul nu repeta anul.\" -- afirma P pentru a nega Q; forma diferita (nu negarea lui P ci afirmarea lui P). NU PARALELA: \"Proiectul va fi livrat la termen si clientul nu va solicita penalitati. Proiectul a fost livrat. Deci clientul nu va solicita penalitati.\" -- conjunctie in loc de disjunctie; structura fundamental diferita.",
      },
    ],
  },

  // 3. steps -- 4 pasi pentru rezolvarea parallel reasoning questions
  {
    type: "steps",
    steps: [
      {
        title: "Abstractizeaza argumentul original",
        content: [
          {
            type: "paragraph",
            text: "Inlocuieste fiecare categorie, propozitie sau entitate cu o litera. A, B, C pentru categorii in argumente categorice. P, Q pentru propozitii in argumente conditionale sau disjunctive. Nu sari peste acest pas -- abstractizarea este singura modalitate de a compara structuri logic.",
          },
        ],
      },
      {
        title: "Scrie forma in mod explicit",
        content: [
          {
            type: "paragraph",
            text: "Noteaza forma pe hartie sau mental: \"Toti A sunt B. X este A. Deci X este B.\" sau \"Daca P atunci Q. Nu Q. Deci Nu P.\". Fii atent la: cantificatori (toti / unii / niciun), directia conditionalului (P->Q nu e acelasi cu Q->P), negari (Nu P vs P).",
          },
        ],
      },
      {
        title: "Testeaza fiecare varianta pe forma",
        content: [
          {
            type: "paragraph",
            text: "Abstractizeaza fiecare varianta si compara cu forma originala. Elimina rapid variantele cu cantificatori diferiti (\"unii\" vs \"toti\"), cu conditionale inversate, sau cu negari lipsa. Raman una sau doua candidate -- analizeaza-le mai atent.",
          },
        ],
      },
      {
        title: "Ignora continutul -- conteaza doar forma",
        content: [
          {
            type: "paragraph",
            text: "Cel mai mare risc in parallel reasoning: esti distras de continut. O varianta despre ecologie poate parea mai relevanta decat una despre contracte, dar daca forma e diferita, e gresita. O varianta care suna absurd sau neplauzibil poate fi totusi corecta daca forma e identica. Forteaza-te sa evaluezi doar structura.",
          },
        ],
      },
    ],
  },

  // 4. recall -- 3 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Argument original: \"Daca un proiect depaseste bugetul, managerul trebuie sa raporteze abaterea. Proiectul Alpha a depasit bugetul. Deci, managerul trebuie sa raporteze abaterea.\" Forma: Daca P atunci Q. P. Deci Q. Care varianta este PARALELA?",
        options: [
          "\"Daca produsul are defecte, returneaza-l. Produsul nu are defecte. Deci nu il returna.\"",
          "\"Daca temperatura scade sub zero, conductele pot ingheata. Temperatura a scazut sub zero. Deci conductele pot ingheata.\"",
          "\"Daca managerul raporteaza, proiectul a depasit bugetul. Managerul a raportat. Deci proiectul a depasit bugetul.\"",
          "\"Toate proiectele care depasesc bugetul sunt anulate. Proiectul Alpha depaseste bugetul. Deci este anulat.\"",
        ],
        correct: 1,
      },
      {
        question: "De ce varianta \"Toti inginerii cu certificare avansata au promovat examenul. Dan nu are certificare avansata. Deci Dan nu a promovat examenul\" NU este paralela cu \"Toti A sunt B. X este A. Deci X este B\"?",
        options: [
          "Pentru ca vorbeste despre ingineri, nu despre o categorie generala.",
          "Pentru ca neaga antecedentul (nu X nu este A din toti A sunt B nu rezulta nu X este B).",
          "Pentru ca Dan poate fi sau nu inginer.",
          "Pentru ca forma ei este corecta -- este paralela.",
        ],
        correct: 1,
      },
      {
        question: "La o intrebare de parallel reasoning, doua variante par sa aiba aceeasi forma. Cum le diferentiezi?",
        options: [
          "O alegi pe cea cu continut mai similar argumentului original.",
          "O alegi pe cea mai lunga -- contine mai multa informatie.",
          "Abstractizezi ambele complet si compari cu forma originala semn cu semn: cantificatori, directia conditionalului, negari.",
          "O alegi pe cea care pare mai logica in lumea reala.",
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
    `lessons?title=eq.${encodeURIComponent("Parallel Reasoning")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Parallel Reasoning\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L3_6_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L3_6_CONTENT.length} nodes: concept, concept (2 argumente + variante), steps (4), recall (3 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Parallel Reasoning
  Block:  ${result.data?.id}
  Nodes:  ${L3_6_CONTENT.length}

  View at: http://localhost:5173/lessons/parallel-reasoning
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

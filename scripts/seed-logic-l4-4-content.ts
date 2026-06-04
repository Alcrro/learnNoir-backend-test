/**
 * Seed: L4.4 — Complete the Argument (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l4-4-content.ts
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

const L4_4_CONTENT = [
  // 1. concept -- Ce cer complete the argument questions
  {
    type: "concept",
    title: "Complete the Argument -- tipuri si strategie",
    sections: [
      {
        label: "Tipurile de completare",
        text: "Complete the Argument (sau Complete the Passage) este o intrebare GMAT CR in care pasajul contine o fraza incompleta -- de obicei marcata cu \"______\". Exista trei subtipuri: (1) Completare cu CONCLUZIE: premisele sunt date, lipseste concluzia -- alegi varianta care decurge logic din premise. (2) Completare cu PREMISA: concluzia e data, lipseste o premisa necesara -- alegi varianta care furnizeaza suportul logic lips. (3) Completare LOGICA: lipseste un link intermediar dintr-un lant de rationament -- alegi varianta care face argumentul coerent. Stem-ul tipic: \"Which of the following most logically completes the argument?\"",
      },
      {
        label: "Strategia",
        text: "Pasul 1: Citeste pasajul si identifica ce lipseste -- o concluzie, o premisa, sau un link logic? Pasul 2: Identifica structura existenta: ce stim deja, in ce directie merge argumentul. Pasul 3: Pre-formuleaza completarea inainte sa citesti variantele -- ce tip de informatie trebuie sa ocupe golul? Pasul 4: Alege varianta care (a) se potriveste gramatical cu fraza incompleta, (b) este sustinuta de premise (nu introduce ipoteze externe), (c) face argumentul coerent si valid. Capcanele frecvente: variante care sunt adevarate in general dar nu decurg din premisele date; variante care introduc conditii externe neprezente in pasaj.",
      },
      {
        label: "Diferenta fata de assumption questions",
        text: "La assumption questions, presupunerea e implicita -- nu e scrisa in pasaj si trebuie dedusa. La complete the argument, golul e explicit -- exista o fraza incompleta pe care trebuie sa o umpli. Insa logica e similara: cauti cea mai conservatoare completare care face argumentul valid. Diferenta practica: la complete the argument, varianta corecta apare NATURAL in locul golului; la assumption, varianta corecta supravietuieste testului negarii.",
      },
    ],
  },

  // 2. concept -- 3 pasaje cu complete the argument (inlocuieste example)
  {
    type: "concept",
    title: "3 pasaje GMAT cu completari diferite -- analiza variantelor",
    sections: [
      {
        label: "Pasajul 1 -- completare cu concluzie",
        text: "Pasaj: \"Toate companiile care au implementat un sistem de feedback continuu au inregistrat o scadere a fluctuatiei de personal. Compania noastra tocmai a implementat un astfel de sistem. Prin urmare, ______.\" Variante: (A) angajatii nostri vor fi mai multumiti de munca lor; (B) compania noastra va inregistra o scadere a fluctuatiei de personal; (C) vom atrage mai multi candidati de calitate; (D) costurile de recrutare vor scadea semnificativ. CORECTA: (B) -- decurge direct din silogismul categoric: Toti A au B; noi suntem A; deci vom avea B. Variantele A, C, D introduc consecinte neprecizate in premise.",
      },
      {
        label: "Pasajul 2 -- completare cu premisa",
        text: "Pasaj: \"Productivitatea echipei de dezvoltare software a crescut cu 25% in ultimul trimestru. ______. Prin urmare, introducerea metodologiei Agile a cauzat cresterea productivitatii.\" Variante: (A) Metodologia Agile a fost adoptata in urma cu exact un trimestru; (B) Angajatii au primit bonusuri in acelasi trimestru; (C) Managementul a schimbat structura echipelor; (D) Cresterea productivitatii a fost observata si la alte companii. CORECTA: (A) -- furnizeaza legatura temporala necesara pentru a atribui cresterea metodologiei Agile. Fara aceasta premisa, argumentul nu poate sustine concluzia cauzala. Varianta B ar slabi argumentul (explicatie alternativa), nu l-ar completa.",
      },
      {
        label: "Pasajul 3 -- completare cu link logic",
        text: "Pasaj: \"Studiile arata ca somnul de calitate imbunatateste memoria de lucru. Memoria de lucru buna este esentiala pentru rezolvarea problemelor complexe. ______. Prin urmare, angajatii odihniti sunt mai eficienti in sarcini care cer gandire analitica.\" Variante: (A) Gandirea analitica necesita rezolvarea de probleme complexe; (B) Angajatii odihniti dorm mai bine; (C) Rezolvarea problemelor complexe nu depinde de somn; (D) Memoria de lucru nu are legatura cu gandirea analitica. CORECTA: (A) -- face lantul logic complet: somn bun -> memorie buna -> rezolvare probleme complexe (via A) -> gandire analitica. Varianta D ar distruge lantul logic.",
      },
    ],
  },

  // 3. fill-blanks -- 2 argumente incomplete
  {
    type: "fill-blanks",
    title: "Completeaza argumentele cu varianta logica corecta",
    language: "text",
    content: "Argument 1: \"Niciun produs certificat organic nu poate contine aditivi artificiali. Produsul Z contine aditivi artificiali. Prin urmare, ______.\"\n\nCompletare corecta: {{0}}\n\n---\n\nArgument 2: \"Rata de succes a antreprenorilor care au urmat un program de mentorat este de doua ori mai mare decat a celor care nu au urmat. ______. Prin urmare, participarea la un program de mentorat creste sansele de succes antreprenorial.\"\n\nCompletare corecta: {{1}}",
    blanks: [
      {
        id: 0,
        options: [
          "Produsul Z nu este certificat organic",
          "Produsul Z este periculos pentru sanatate",
          "Toti aditivii artificiali sunt interzisi",
        ],
        correct: "Produsul Z nu este certificat organic",
      },
      {
        id: 1,
        options: [
          "Antreprenorii care au succes sunt mai creativi",
          "Aceasta diferenta de succes nu este explicata de alti factori precum experienta anterioara sau accesul la capital",
          "Programele de mentorat sunt disponibile oriunde in lume",
        ],
        correct: "Aceasta diferenta de succes nu este explicata de alti factori precum experienta anterioara sau accesul la capital",
      },
    ],
  },

  // 4. recall -- 3 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Care dintre urmatoarele descrie cel mai bine strategia pentru o complete the argument question?",
        options: [
          "Alegi varianta care este adevarata in general si care se potriveste cu subiectul pasajului.",
          "Alegi varianta care face argumentul cel mai puternic posibil, chiar daca introduce informatii externe.",
          "Identifici ce lipseste (concluzie, premisa sau link), pre-formulezi completarea, si alegi varianta care ocupa golul fara sa introduca ipoteze externe.",
          "Alegi varianta cea mai lunga -- de obicei are mai multa informatie relevanta.",
        ],
        correct: 2,
      },
      {
        question: "Pasaj: \"Toti furnizorii certificati au trecut auditul de calitate. Furnizorul Omega nu a trecut auditul de calitate. Prin urmare, ______.\" Care varianta completeaza corect argumentul?",
        options: [
          "Furnizorul Omega are produse de calitate slaba.",
          "Furnizorul Omega nu este un furnizor certificat.",
          "Auditul de calitate este prea strict.",
          "Furnizorul Omega ar trebui sa reteste.",
        ],
        correct: 1,
      },
      {
        question: "Cum se deosebeste complete the argument de assumption questions?",
        options: [
          "La complete the argument, golul e explicit (o fraza incompleta); la assumption, presupunerea e implicita si trebuie dedusa.",
          "La complete the argument, cauti slabiciunea argumentului; la assumption, cauti dovezi pro.",
          "La complete the argument, raspunsul e intotdeauna o concluzie; la assumption, e intotdeauna o premisa.",
          "Nu exista nicio diferenta -- ambele cer aceeasi strategie.",
        ],
        correct: 0,
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
    `lessons?title=eq.${encodeURIComponent("Complete the Argument")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Complete the Argument\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L4_4_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L4_4_CONTENT.length} nodes: concept, concept (3 pasaje GMAT), fill-blanks (2 argumente), recall (3 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Complete the Argument
  Block:  ${result.data?.id}
  Nodes:  ${L4_4_CONTENT.length}

  View at: http://localhost:5173/lessons/complete-the-argument
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

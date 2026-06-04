/**
 * Seed: L4.2 — Boldface Questions (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l4-2-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; GMAT passages use concept block.
 * DragSortNode is algorithm-only; role labeling uses fill-blanks.
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

const L4_2_CONTENT = [
  // 1. concept -- Ce sunt boldface questions
  {
    type: "concept",
    title: "Boldface Questions -- ce cer si cum le abordezi",
    sections: [
      {
        label: "Ce cer boldface questions",
        text: "Boldface questions (BF) sunt intrebari GMAT CR specifice in care una sau doua propozitii din pasaj sunt scrise cu litere ingrosate (bold). Stem-ul cere sa identifici ROLUL fiecarei propozitii boldate in structura argumentului -- nu sa evaluezi daca argumentul e bun sau rau. Exemple de stem: \"In the argument above, the two boldfaced portions play which of the following roles?\" sau \"The boldfaced portion plays which of the following roles in the argument above?\" Aceasta intrebare nu are nicio legatura cu strengthening, weakening sau flaws -- e pur structurala.",
      },
      {
        label: "Rolurile posibile ale unei propozitii boldate",
        text: "CONCLUZIE PRINCIPALA: propozitia pe care intregul argument o sustine -- rolul cel mai important. PREMISA / DOVADA: afirmatie factual prezentata ca suport pentru concluzie. CONCLUZIE INTERMEDIARA (sub-concluzie): propozitie care e sustinuta de o alta premisa si care, la randul ei, sustine concluzia principala. POZITIA OPUSA / CONTRAARGUMENT: pozitia pe care autorul o respinge sau o critica. EVIDENCE AGAINST: dovada impotriva pozitiei autorului, pe care autorul o introduce pentru a o combate ulterior. CONCLUZIE OPUSA: ce sustine pozitia adversa -- pe care autorul nu o accepta.",
      },
      {
        label: "Strategia pentru boldface questions",
        text: "Pasul 1: Citeste intregul pasaj si identifica structura: cine sustine ce, care e pozitia autorului, care e pozitia opusa. Pasul 2: Identifica rolul fiecarei propozitii boldate in raport cu structura globala -- e premisa, concluzie, contraargument? Pasul 3: Formuleaza rolul in cuvinte proprii INAINTE sa citesti variantele. Pasul 4: Cauta varianta care descrie corect AMBELE propozitii boldate (daca sunt doua). Capcanele frecvente: variante care descriu corect prima boldface dar gresit pe a doua; variante care spun ca o premisa e o concluzie sau viceversa.",
      },
    ],
  },

  // 2. concept -- 2 pasaje GMAT cu boldface questions (inlocuieste example)
  {
    type: "concept",
    title: "2 pasaje GMAT Boldface -- analiza completa a rolului frazelor boldate",
    sections: [
      {
        label: "Pasajul 1 si intrebarea",
        text: "Pasaj: \"[BOLD: Cercetarile arata ca angajatii care lucreaza de acasa sunt in medie cu 13% mai productivi decat cei de la birou.] Prin urmare, compania noastra ar trebui sa adopte un program de lucru complet remote. [BOLD: Este adevarat ca unii angajati prefera mediul de birou pentru socializare si colaborare.] Totusi, castigul de productivitate depaseste cu mult acest dezavantaj minor.\" Intrebare: \"In argumentul de mai sus, cele doua portiuni ingrosate joaca urmatoarele roluri:\"",
      },
      {
        label: "Analiza Pasajului 1",
        text: "BOLDFACE 1 (\"Cercetarile arata ca angajatii care lucreaza de acasa sunt mai productivi\"): Este o PREMISA / DOVADA empirica -- suporta direct concluzia ca programul remote e de adoptat. BOLDFACE 2 (\"Este adevarat ca unii angajati prefera mediul de birou\"): Este o POZITIE OPUSA pe care autorul o recunoaste (concesie) dar o respinge in fraza urmatoare (\"totusi, castigul depaseste dezavantajul\"). Raspuns corect: \"Prima este o dovada in sprijinul concluziei autorului; a doua este o consideratie pe care autorul o recunoaste dar o trateaza ca insemnificativa.\"",
      },
      {
        label: "Pasajul 2 si intrebarea",
        text: "Pasaj: \"[BOLD: Toate programele educationale care au primit finantare federala in ultimii 5 ani au raportat imbunatatiri ale scorurilor la testele standardizate.] Programul Alpha a primit finantare federala anul trecut. [BOLD: Prin urmare, Programul Alpha va raporta imbunatatiri ale scorurilor.] Insa aceasta concluzie ignora faptul ca Programul Alpha vizeaza populatii cu nevoi speciale, pentru care testele standardizate sunt inadecvate.\" Intrebare: \"Rolul celor doua portiuni ingrosate:\"",
      },
      {
        label: "Analiza Pasajului 2",
        text: "BOLDFACE 1 (\"Toate programele care au primit finantare federala au raportat imbunatatiri\"): Este o PREMISA GENERALA -- cuantificatorul \"toate\" o face baza silogismului. Autorul o prezinta ca adevarata. BOLDFACE 2 (\"Prin urmare, Programul Alpha va raporta imbunatatiri\"): Este o CONCLUZIE INTERMEDIARA (sau concluzia pasajului initial), pe care autorul o contesta in fraza urmatoare -- autorul nu e de acord ca aceasta concluzie tine in cazul Programului Alpha. Raspuns corect: \"Prima este o premisa generala pe care se bazeaza un rationament; a doua este concluzia acelui rationament, pe care autorul o pune sub semnul intrebarii.\"",
      },
    ],
  },

  // 3. recall -- 3 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Ce tip de intrebare este o boldface question in GMAT CR?",
        options: [
          "O intrebare care cere sa identifici slabiciunea logica a argumentului.",
          "O intrebare care cere sa identifici rolul structural al propozitiei(lor) ingrosate in argument.",
          "O intrebare care cere sa alegi cea mai buna dovada pentru a sustine concluzia.",
          "O intrebare care cere sa completezi o fraza lipsa din argument.",
        ],
        correct: 1,
      },
      {
        question: "Pasaj: \"Studiile arata ca dieta mediteraneana reduce riscul bolilor cardiovasculare. [BOLD: Prin urmare, persoanele cu risc cardiac ar trebui sa adopte dieta mediteraneana.] Este adevarat ca dieta implica restrictii semnificative. [BOLD: Cu toate acestea, beneficiile pe termen lung depasesc cu mult inconvenientele pe termen scurt.]\" Care este rolul celei de-a doua propozitii ingrosate?",
        options: [
          "Este concluzia principala a argumentului.",
          "Este o premisa care contrazice argumentul autorului.",
          "Este o concluzie suplimentara care consolideaza pozitia autorului dupa recunoasterea unui dezavantaj.",
          "Este o concluzie intermediara pe care autorul o respinge.",
        ],
        correct: 2,
      },
      {
        question: "Cand variantele de raspuns la o boldface question descriu corect prima propozitie ingrosata dar gresit pe a doua, ce trebuie sa faci?",
        options: [
          "Alegi varianta cu prima descriere corecta -- a doua e mai putin importanta.",
          "Elimini acea varianta -- ambele descrieri trebuie sa fie corecte simultan.",
          "Alegi varianta cu cea mai scurta descriere a celei de-a doua propozitii.",
          "Te uiti doar la prima propozitie ingrosata -- a doua e de obicei o premisa.",
        ],
        correct: 1,
      },
    ],
  },

  // 4. fill-blanks -- 5 propozitii, identifica rolul (inlocuieste drag-sort)
  {
    type: "fill-blanks",
    title: "Identifica rolul fiecarei propozitii in argument",
    language: "text",
    content: "Argument: \"Companiile care investesc in training-ul angajatilor au o rata de retentie cu 30% mai mare. Firma noastra are o rata de retentie slaba. Prin urmare, ar trebui sa investim in training. Este adevarat ca training-ul are costuri initiale ridicate. Insa costul inlocuirii unui angajat depaseste de 3 ori costul training-ului.\"\n\n1. \"Companiile care investesc in training au o rata de retentie cu 30% mai mare.\"  ->  {{0}}\n2. \"Firma noastra are o rata de retentie slaba.\"  ->  {{1}}\n3. \"Ar trebui sa investim in training.\"  ->  {{2}}\n4. \"Este adevarat ca training-ul are costuri initiale ridicate.\"  ->  {{3}}\n5. \"Costul inlocuirii unui angajat depaseste de 3 ori costul training-ului.\"  ->  {{4}}",
    blanks: [
      {
        id: 0,
        options: ["premisa / dovada empirica", "concluzie principala", "pozitie opusa"],
        correct: "premisa / dovada empirica",
      },
      {
        id: 1,
        options: ["premisa contextuala", "concluzie principala", "contraargument"],
        correct: "premisa contextuala",
      },
      {
        id: 2,
        options: ["concluzie principala", "premisa / dovada empirica", "concluzie intermediara"],
        correct: "concluzie principala",
      },
      {
        id: 3,
        options: ["pozitie opusa / concesie", "premisa / dovada empirica", "concluzie principala"],
        correct: "pozitie opusa / concesie",
      },
      {
        id: 4,
        options: ["raspuns la pozitia opusa (contraargument la concesie)", "premisa principala", "concluzie intermediara"],
        correct: "raspuns la pozitia opusa (contraargument la concesie)",
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
    `lessons?title=eq.${encodeURIComponent("Boldface Questions")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Boldface Questions\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L4_2_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L4_2_CONTENT.length} nodes: concept, concept (2 pasaje GMAT), recall (3 MCQ), fill-blanks (5 propozitii)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Boldface Questions
  Block:  ${result.data?.id}
  Nodes:  ${L4_2_CONTENT.length}

  View at: http://localhost:5173/lessons/boldface-questions
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

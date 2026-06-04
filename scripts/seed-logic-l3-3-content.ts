/**
 * Seed: L3.3 — Strengthen & Weaken Questions (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l3-3-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; LSAT examples use concept block.
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

const L3_3_CONTENT = [
  // 1. concept -- Strengthen vs Weaken
  {
    type: "concept",
    title: "Strengthen vs Weaken -- definitie si strategie",
    sections: [
      {
        label: "Definitie",
        text: "Strengthen (intarire): o informatie noua care creste probabilitatea ca concluzia sa fie adevarata, data fiind premisele. Weaken (slabire): o informatie noua care scade probabilitatea ca concluzia sa fie adevarata, data fiind premisele. Ambele tipuri nu modifica premisele existente -- adauga informatii externe care afecteaza puterea legaturii dintre premise si concluzie.",
      },
      {
        label: "Ce inseamna cel mai mult (degree, nu absolut)",
        text: "Intrebarea cere varianta care intareste SAU slabeste \"cel mai mult\" -- nu o face imposibila sau certa. Nu cauti dovezi absolute. Cauti informatia care are cel mai mare impact asupra legaturii dintre premise si concluzie. Doua variante pot ambele slabi argumentul -- o alegi pe cea care il afecteaza mai direct si mai profund.",
      },
      {
        label: "Strategia",
        text: "Pasul 1: Identifica concluzia si premisele. Pasul 2: Identifica presupunerea centrala (gap-ul logic). Pasul 3: Pre-formuleaza ce tip de informatie ar umple / ataca acest gap. Strengthen: confirma presupunerea sau elimina explicatii alternative. Weaken: ataca presupunerea sau ofera o explicatie alternativa pentru concluzie. Pasul 4: Testati fiecare varianta: afecteaza legatura premisa-concluzie sau e doar relevant pentru subiect?",
      },
    ],
  },

  // 2. concept -- 2 argumente cu analiza completa a variantelor (inlocuieste example)
  {
    type: "concept",
    title: "2 argumente LSAT -- analiza completa Strengthen si Weaken",
    sections: [
      {
        label: "Argument 1 -- Strengthen Question",
        text: "Pasaj: \"Programul de mentoring din compania X a crescut retentia angajatilor cu 25% in primul an de implementare. Deci, programul ar trebui extins la toate departamentele.\" Presupunere: cresterea retentiei este cauzata de mentoring, nu de alti factori. Stem: \"Care varianta intareste cel mai mult argumentul?\" Varianta corecta: \"Departamentele fara mentoring au inregistrat in acelasi an o scadere a retentiei.\" -- elimina explicatia alternativa (factori externi au afectat toate departamentele) si confirma cauzalitatea. Variante incorecte: \"Angajatii din program au evaluat pozitiv experienta\" -- relevant, dar nu confirma cauzalitatea; \"Programul costa 50.000 EUR\" -- neutral sau usor negativ pentru extindere.",
      },
      {
        label: "Argument 2 -- Weaken Question",
        text: "Pasaj: \"Reducerea vitezei maxime pe autostrazile din regiunile pilot a scazut numarul accidentelor grave cu 30%. Prin urmare, reducerea vitezei la nivel national va reduce accidentele grave.\" Presupunere: regiunile pilot sunt reprezentative si nu exista factori locali care explica scaderea. Stem: \"Care varianta slabeste cel mai mult argumentul?\" Varianta corecta: \"In aceeasi perioada, regiunile pilot au beneficiat si de modernizarea masiva a infrastructurii rutiere.\" -- ofera o explicatie alternativa pentru scaderea accidentelor. Variante incorecte: \"Soferii prefera viteze mai mari\" -- relevant pentru acceptare, nu pentru eficacitate; \"Alte tari au redus viteza cu rezultate bune\" -- neutral sau usor pozitiv.",
      },
    ],
  },

  // 3. heading -- Capcana frecventa
  {
    type: "heading",
    text: "Capcana frecventa: variantele neutre",
    level: 2,
  },

  // 4. paragraph -- Variantele neutrale
  {
    type: "paragraph",
    text: "Variantele care par relevante pentru subiect dar nu afecteaza legatura dintre premise si concluzie sunt neutrala -- si sunt principala capcana in intrebarile Strengthen/Weaken. Exemplu: intr-un argument despre efectele cafelei asupra productivitatii, varianta \"Cafeaua contine cafeina\" pare relevanta (e despre cafea) dar nu spune nimic despre legatura dintre cafeina si productivitate. Multi studenti aleg astfel de variante pentru ca suna la subiect. Testul corect nu e \"e legata de subiect?\" ci \"afecteaza forta logica a argumentului?\"",
  },

  // 5. recall -- 4 MCQ alternand strengthen/weaken
  {
    type: "recall",
    questions: [
      {
        question: "Argument: \"Orasele care au implementat zone pietonale extinse au inregistrat o crestere a vanzarilor in comertul local. Deci, extinderea zonelor pietonale creste vanzarile comerciantilor locali.\" Care varianta INTARESTE cel mai mult argumentul?",
        options: [
          "Comerciantii locali au declarat ca prefera mai multi clienti.",
          "Orasele fara zone pietonale extinse au inregistrat stagnare sau scadere a vanzarilor in aceeasi perioada.",
          "Zonele pietonale imbunatatesc calitatea aerului urban.",
          "Proiectele de pietonal costa in medie 2 milioane de euro.",
        ],
        correct: 1,
      },
      {
        question: "Argument: \"Angajatii care lucreaza de acasa raporteaza niveluri mai ridicate de satisfactie la locul de munca. Deci, munca de acasa imbunatateste productivitatea angajatilor.\" Care varianta SLABESTE cel mai mult argumentul?",
        options: [
          "Unii angajati prefera biroul pentru interactiunea sociala.",
          "Satisfactia la locul de munca si productivitatea sunt doua dimensiuni distincte, fara o corelatie dovedita.",
          "Munca de acasa reduce costurile de transport ale angajatilor.",
          "Companiile cu politici flexibile au angajati mai fericiti.",
        ],
        correct: 1,
      },
      {
        question: "Argument: \"Consumul de peste de cel putin doua ori pe saptamana este asociat cu un risc redus de boli cardiovasculare. Deci, cresterea consumului de peste reduce riscul cardiovascular.\" Care varianta este NEUTRA -- nu intareste si nu slabeste argumentul?",
        options: [
          "Persoanele care consuma peste au si alte obiceiuri alimentare sanatoase, ceea ce ar explica riscul redus.",
          "Pestele este o sursa buna de proteine si acizi grasi omega-3.",
          "Studiile au urmarit participantii timp de 20 de ani.",
          "Riscul cardiovascular scade si in randul vegetarienilor stricti.",
        ],
        correct: 1,
      },
      {
        question: "La o intrebare de Weaken, gasesti doua variante care par sa slabeasca argumentul. Cum alegi?",
        options: [
          "Alegi pe prima care apare in lista -- ordinea indica relevanta.",
          "Alegi pe cea care face concluzia complet imposibila.",
          "Alegi pe cea care ataca mai direct presupunerea centrala a argumentului, nu subiectul general.",
          "Alegi pe cea mai scurta -- variantele mai scurte sunt de obicei corecte la LSAT.",
        ],
        correct: 2,
      },
    ],
  },

  // 6. fill-blanks -- Strengthen vs Weaken aplicat
  {
    type: "fill-blanks",
    title: "Identifica tipul de informatie",
    language: "text",
    content: "Argument: Scoala care a introdus ora de meditatie zilnica a inregistrat o scadere cu 20% a cazurilor de anxietate in randul elevilor in primul semestru.\nConcluzie: Meditatia zilnica reduce anxietatea la elevi.\n\nO informatie care INTARESTE argumentul: {{0}}\nO informatie care SLABESTE argumentul: {{1}}",
    blanks: [
      {
        id: 0,
        options: [
          "Scolile similare fara meditatie nu au inregistrat nicio scadere a anxietatii in acelasi interval.",
          "Elevii au declarat ca le place ora de meditatie.",
          "Meditatia este practicata si de adulti in multe tari.",
        ],
        correct: "Scolile similare fara meditatie nu au inregistrat nicio scadere a anxietatii in acelasi interval.",
      },
      {
        id: 1,
        options: [
          "In acelasi semestru, scoala a angajat si doi consilieri psihologici suplimentari.",
          "Unii elevi au refuzat sa participe la ora de meditatie.",
          "Meditatia nu este parte din curriculumul national.",
        ],
        correct: "In acelasi semestru, scoala a angajat si doi consilieri psihologici suplimentari.",
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
    `lessons?title=eq.${encodeURIComponent("Strengthen & Weaken")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Strengthen & Weaken\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L3_3_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L3_3_CONTENT.length} nodes: concept, concept (2 argumente), heading, paragraph, recall (4 MCQ), fill-blanks`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Strengthen & Weaken
  Block:  ${result.data?.id}
  Nodes:  ${L3_3_CONTENT.length}

  View at: http://localhost:5173/lessons/strengthen-weaken
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

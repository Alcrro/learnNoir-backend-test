/**
 * Seed: L4.1 — GMAT Argument Structure (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l4-1-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; GMAT passage uses concept block.
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

const L4_1_CONTENT = [
  // 1. concept -- Diferentele GMAT CR fata de LSAT LR
  {
    type: "concept",
    title: "GMAT Critical Reasoning vs LSAT Logical Reasoning -- diferente cheie",
    sections: [
      {
        label: "Lungimea si densitatea pasajelor",
        text: "LSAT LR: pasaje de 5-8 propozitii, cu context elaborat, concesii si argumente secundare. GMAT CR: pasaje de 2-4 propozitii, directe, fara introduceri extinse. La GMAT, fiecare propozitie conteaza -- nu exista umplutura. Implicatia practica: la GMAT citesti mai rapid, dar fiecare cuvant e potential relevant; nu poti sari propozitii.",
      },
      {
        label: "Tipurile de intrebari",
        text: "Comune cu LSAT: Strengthen, Weaken, Assumption, Flaw, Inference. Specifice GMAT: Boldface (identifica rolul propozitiilor subliniate), Evaluate the Argument (ce informatie ar fi cea mai utila pentru a evalua argumentul), Complete the Argument (completeaza o fraza din pasaj). Tipurile GMAT-specifice cer o intelegere mai nuantata a structurii argumentului, nu doar a gap-ului logic.",
      },
      {
        label: "Strategia generala GMAT CR",
        text: "Principiul stem-first ramane valabil: citesti intrebarea inainte de pasaj. La GMAT, tipul de intrebare e de obicei mai usor de identificat din stem decat la LSAT. Argumentele GMAT au de obicei o presupunere centrala mai vizibila si un gap logic mai clar. Capcana GMAT: pasajele scurte creeaza falsa senzatie ca totul e deja inteles -- cel mai frecvent, studentii sar prea repede la variante fara pre-formulare.",
      },
    ],
  },

  // 2. concept -- Pasaj GMAT CR complet disectat (inlocuieste example)
  {
    type: "concept",
    title: "Pasaj GMAT CR disectat -- cu diferentele fata de LSAT evidentiate",
    sections: [
      {
        label: "Pasajul",
        text: "O companie de software a introdus un program de lucru flexibil pentru toti angajatii. Dupa trei luni, 85% din angajati au raportat o satisfactie mai mare la locul de munca. Prin urmare, programul de lucru flexibil a imbunatatit starea de bine a angajatilor companiei.",
      },
      {
        label: "Structura disecata",
        text: "[PREMISA 1] \"Compania a introdus programul flexibil.\" -- contextul actiunii. [PREMISA 2] \"85% raporteaza satisfactie mai mare dupa 3 luni.\" -- dovada empirica. [CONCLUZIE] \"Programul a imbunatatit starea de bine.\" -- ce sustine autorul. Diferenta fata de LSAT: niciun background elaborat, nicio pozitie opusa, nicio concesie -- direct la argument in 3 propozitii.",
      },
      {
        label: "Gap-ul logic si presupunerea",
        text: "Gap 1: satisfactia mai mare la locul de munca = starea de bine imbunatatita (nu neaparat -- satisfactia profesionala e o dimensiune, starea de bine e mai larga). Gap 2: nu exista alti factori care ar fi putut creste satisfactia simultan (majorari salariale, schimbari de management, etc.). La GMAT, aceste doua gap-uri sunt mai vizibile decat la LSAT tocmai pentru ca pasajul e scurt si explicit.",
      },
      {
        label: "Intrebarea si pre-formularea",
        text: "Stem: \"Care dintre urmatoarele, daca ar fi adevarata, slabeste cel mai mult argumentul?\" Pre-formulare: caut o informatie care arata fie ca satisfactia mai mare nu provine din programul flexibil (explicatie alternativa), fie ca satisfactia nu reflecta starea de bine in ansamblu. Raspuns corect asteptat: \"In aceeasi perioada, compania a acordat si cele mai mari mariri salariale din ultimii 5 ani.\" -- explicatie alternativa directa.",
      },
    ],
  },

  // 3. steps -- Procesul GMAT CR
  {
    type: "steps",
    steps: [
      {
        title: "Identifica tipul de intrebare din stem",
        content: [
          {
            type: "paragraph",
            text: "Citeste stem-ul si clasifica intrebarea: Strengthen / Weaken / Assumption / Flaw / Inference / Boldface / Evaluate / Complete. La GMAT, aceasta clasificare e rapida -- stem-urile sunt directe. Tipul determina ce cauti in pasaj si cum pre-formulezi.",
          },
        ],
      },
      {
        title: "Citeste pasajul activ",
        content: [
          {
            type: "paragraph",
            text: "La GMAT, pasajele sunt scurte -- citeste fiecare propozitie cu atentie maxima. Identifica rolul fiecarei propozitii: premisa, concluzie, context, pozitie opusa. La Boldface questions, noteaza mental rolul propozitiilor subliniate pe masura ce le citesti.",
          },
        ],
      },
      {
        title: "Identifica concluzia si premisele",
        content: [
          {
            type: "paragraph",
            text: "La GMAT, concluzia e de obicei ultima propozitie si e introdusa de cuvinte indicator clare. Daca nu e clara, intreaba-te: \"Ce vrea autorul sa demonstreze?\" Toate celelalte propozitii care sustin aceasta sunt premise.",
          },
        ],
      },
      {
        title: "Pre-formuleaza raspunsul",
        content: [
          {
            type: "paragraph",
            text: "Inainte de variante, identifica presupunerea centrala sau gap-ul logic. Pre-formuleaza ce tip de informatie cauti: pentru Weaken -- o explicatie alternativa sau un atac la presupunere; pentru Strengthen -- o confirmare a presupunerii sau eliminarea unei alternative; pentru Assumption -- ce trebuie sa fie adevarat pentru ca argumentul sa tina.",
          },
        ],
      },
      {
        title: "Elimina si alege",
        content: [
          {
            type: "paragraph",
            text: "Elimina variantele care: sunt despre subiect dar nu despre structura argumentului (neutrala), merg in directia opusa (intareste in loc sa slabeasca), introduc informatii complet nerelevante. Dintre cele ramase, alege pe cea care se potriveste cel mai precis cu pre-formularea -- nu pe cea care suna mai interesant sau mai plauzibil.",
          },
        ],
      },
    ],
  },

  // 4. recall -- 2 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "In pasajul disectat despre programul flexibil, care este presupunerea centrala a argumentului?",
        options: [
          "Angajatii companiei de software sunt mai productivi decat media.",
          "Satisfactia mai mare la locul de munca reflecta o imbunatatire a starii de bine in general, si nu exista alti factori care sa explice cresterea.",
          "Programele flexibile de lucru sunt adoptate de toate companiile mari.",
          "Sondajele de satisfactie sunt intotdeauna un indicator de incredere.",
        ],
        correct: 1,
      },
      {
        question: "Care este principala diferenta practica intre un pasaj GMAT CR si unul LSAT LR?",
        options: [
          "GMAT CR nu are intrebari de Strengthen sau Weaken -- acestea sunt exclusive LSAT.",
          "LSAT LR cere intotdeauna identificarea flawului, GMAT CR nu.",
          "GMAT CR are pasaje mai scurte si mai directe, fara context elaborat sau concesii extinse.",
          "GMAT CR are 5 variante de raspuns, LSAT LR are 4.",
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
    `lessons?title=eq.${encodeURIComponent("GMAT Argument Structure")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"GMAT Argument Structure\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L4_1_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L4_1_CONTENT.length} nodes: concept (GMAT vs LSAT), concept (pasaj disectat), steps (5), recall (2 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: GMAT Argument Structure
  Block:  ${result.data?.id}
  Nodes:  ${L4_1_CONTENT.length}

  View at: http://localhost:5173/lessons/gmat-argument-structure
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

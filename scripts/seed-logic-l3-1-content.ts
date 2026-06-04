/**
 * Seed: L3.1 — Anatomy of an LSAT Argument (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l3-1-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; LSAT passage uses concept block.
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

const L3_1_CONTENT = [
  // 1. concept -- Anatomia unui pasaj LSAT LR
  {
    type: "concept",
    title: "Anatomia unui pasaj LSAT Logical Reasoning",
    sections: [
      {
        label: "Background / Context",
        text: "Una sau doua propozitii care stabilesc situatia sau problema generala. Nu contin argumentul principal -- ofera cadrul in care acesta apare. In rezolvare, citesti rapid contextul fara sa il analizezi profund.",
      },
      {
        label: "Argumentul principal",
        text: "Miezul pasajului: una sau mai multe premise care sustin o concluzie. Uneori autorul include si pozitia opusa (\"multi cred X, dar...\") inainte de a-si prezenta argumentul. Aceasta structura de concesie este frecventa si poate genera confuzie daca nu identifici corect pozitia autorului.",
      },
      {
        label: "Concluzia",
        text: "Propozitia pe care argumentul incearca sa o demonstreze. Adesea introdusa de \"deci\", \"prin urmare\", \"in concluzie\", \"rezulta ca\". Poate aparea la inceput sau la sfarsit. Identificarea corecta a concluziei este cel mai important pas -- toate celelalte elemente (premise, presupuneri, contraargumente) sunt definite relativ la ea.",
      },
      {
        label: "Intrebarea stem",
        text: "Fraza de dupa pasaj care defineste tipul de intrebare: Strengthen, Weaken, Assumption, Flaw, Inference, Parallel Reasoning. Citind stem-ul inainte de pasaj stii exact ce sa cauti: un gap logic (Assumption), un defect structural (Flaw), o informatie care afecteaza puterea argumentului (Strengthen/Weaken).",
      },
      {
        label: "Variantele de raspuns",
        text: "5 variante (A-E), dintre care exact una este corecta. Strategia corecta: pre-formulezi raspunsul inainte sa citesti variantele, apoi elimini pe cele care nu corespund pre-formularii. Citind variantele inainte de pre-formulare, esti influentat de variantele gresite care suna plauzibil.",
      },
    ],
  },

  // 2. paragraph -- Strategia de baza
  {
    type: "paragraph",
    text: "Strategia de baza in LSAT Logical Reasoning: citesti intrebarea stem INAINTE de pasaj. Acest lucru iti permite sa citesti pasajul cu un scop specific -- stii daca cauti o presupunere, un punct slab, o inferenta. Fara stem, citesti pasajul generic si trebuie sa-l re-citesti dupa ce vezi intrebarea. Fiecare secunda conteaza la LSAT -- re-citirea este o penalizare de timp pe care strategia corecta o elimina complet.",
  },

  // 3. concept -- Pasaj LSAT complet disectat (inlocuieste example)
  {
    type: "concept",
    title: "Pasaj LSAT disectat complet",
    sections: [
      {
        label: "Pasajul",
        text: "In ultimul deceniu, numarul studentilor inscrisi in programe de licenta online s-a triplat. Multi educatori sustin ca aceasta crestere ameninta calitatea invatamantului superior. Totusi, studiile arata constant ca studentii care termina programe online performeaza la fel de bine ca omologii lor de pe campus la evaluarile standardizate. Prin urmare, cresterea educatiei online nu ameninta calitatea invatamantului superior.",
      },
      {
        label: "Etichetarea fiecarei propozitii",
        text: "[CONTEXT] \"In ultimul deceniu, numarul studentilor inscrisi in programe online s-a triplat.\" -- Stabileste cadrul. [POZITIE OPUSA] \"Multi educatori sustin ca aceasta crestere ameninta calitatea.\" -- Autorul o contrazice. [PREMISA] \"Studiile arata ca studentii online performeaza la fel la evaluarile standardizate.\" -- Dovada prezentata. [CONCLUZIE] \"Prin urmare, cresterea educatiei online nu ameninta calitatea.\" -- Ce vrea autorul sa demonstreze.",
      },
      {
        label: "Stem-ul si tipul intrebarii",
        text: "Intrebare: \"Care dintre urmatoarele, daca ar fi adevarata, slabeste cel mai mult argumentul?\" Tip: Weaken. Pre-formulare inainte de variante: argumentul presupune ca evaluarile standardizate masoara complet calitatea educationala. O informatie care arata ca evaluarile nu captureaza toata calitatea ar slabi argumentul.",
      },
      {
        label: "Analiza variantelor de raspuns",
        text: "(A) Evaluarile standardizate nu masoara toate aspectele relevante ale calitatii educationale. -- CORECT: ataca presupunerea centrala. Daca evaluarile sunt incomplete, performanta egala la ele nu garanteaza calitate egala generala. (B) Numarul programelor online a crescut si in alte tari. -- NEUTRU: nu afecteaza argumentul. (C) Unii studenti prefera online din motive financiare. -- NEUTRU: motivatia nu afecteaza calitatea. (D) Multi profesori de campus predau si cursuri online. -- NEUTRU sau INTARESTE usor: nu slabeste. (E) Evaluarile sunt mai usor de completat online. -- SLABESTE usor, dar mai putin direct decat (A).",
      },
    ],
  },

  // 4. steps -- Procesul de rezolvare in 5 pasi
  {
    type: "steps",
    steps: [
      {
        title: "Citesti stem-ul (intrebarea)",
        content: [
          {
            type: "paragraph",
            text: "Inainte de orice altceva, identifica tipul de intrebare. Cuvintele cheie: \"weakens\" (slabeste), \"strengthens\" (intareste), \"assumes\" (presupune), \"flaw\" (eroare), \"infers\" (deduce), \"parallel\" (paralel). Tipul intrebarii determina tot ce urmeaza.",
          },
        ],
      },
      {
        title: "Citesti pasajul cu scopul in minte",
        content: [
          {
            type: "paragraph",
            text: "Citesti activ, nu pasiv. Identifici: concluzia, premisele, pozitia opusa (daca exista), si -- deja -- posibilele gap-uri logice. La intrebarile de tip Assumption si Flaw, cauti in mod specific saltul logic dintre premise si concluzie.",
          },
        ],
      },
      {
        title: "Pre-formulezi raspunsul",
        content: [
          {
            type: "paragraph",
            text: "Inainte sa deschizi ochii catre variante, formuleaza in propria ta minte ce ar trebui sa contina raspunsul corect. Nu trebuie sa fie exact -- ci directional corect. Exemplu: la Weaken, pre-formularea este \"ceva care arata ca premisa nu sustine concluzia\" sau \"o explicatie alternativa pentru concluzie\".",
          },
        ],
      },
      {
        title: "Elimini variantele gresite",
        content: [
          {
            type: "paragraph",
            text: "Treci rapid prin variante si elimini tot ce nu corespunde pre-formularii. Variantele gresite adesea: sunt relevante pentru subiect dar nu pentru argument (distractor tematic), merg in directia opusa (intaresc in loc sa slabeasca), sau sunt adevarate dar nu afecteaza argumentul (neutru).",
          },
        ],
      },
      {
        title: "Alegi cea mai apropiata de pre-formulare",
        content: [
          {
            type: "paragraph",
            text: "Dintre variantele ramase, alegi pe cea care corespunde cel mai bine pre-formularii. Daca doua variante par corecte, revii la argument si testezi: care dintre ele afecteaza mai direct legatura dintre premise si concluzie? Raspunsul corect ataca intotdeauna structura argumentului, nu subiectul general.",
          },
        ],
      },
    ],
  },

  // 5. think
  {
    type: "think",
    question: "De ce este periculos sa citesti variantele de raspuns INAINTE de a pre-formula? Ce risc specific apare?",
    reveal: "Variantele gresite sunt construite sa sune plauzibil. Daca le citesti fara o pre-formulare proprie, mintea ta se ancora la ele -- un fenomen numit anchoring bias. Vei incepe sa justifici de ce o varianta gresita ar putea fi corecta, in loc sa testezi daca varianta corespunde argumentului. Pre-formularea este un scut impotriva acestui bias: ai deja o directie si compari variantele cu ea, nu te lasi ghidat de ele.",
  },

  // 6. recall -- 2 MCQ pe pasajul disectat
  {
    type: "recall",
    questions: [
      {
        question: "In pasajul disectat despre educatia online, care este premisa principala a argumentului?",
        options: [
          "Numarul studentilor online s-a triplat in ultimul deceniu.",
          "Multi educatori cred ca cresterea online ameninta calitatea.",
          "Studentii online perforemaza la fel ca cei de pe campus la evaluarile standardizate.",
          "Cresterea educatiei online nu ameninta calitatea invatamantului.",
        ],
        correct: 2,
      },
      {
        question: "De ce varianta (A) -- \"evaluarile standardizate nu masoara toate aspectele calitatii\" -- este raspunsul corect la intrebarea de Weaken?",
        options: [
          "Pentru ca arata ca premisele argumentului sunt false.",
          "Pentru ca ataca presupunerea centrala: ca performanta egala la evaluari = calitate egala in general.",
          "Pentru ca demonstreaza ca educatia online este inferioara.",
          "Pentru ca ofera o explicatie alternativa pentru cresterea numarului de studenti online.",
        ],
        correct: 1,
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
    `lessons?title=eq.${encodeURIComponent("Anatomy of an LSAT Argument")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Anatomy of an LSAT Argument\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L3_1_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L3_1_CONTENT.length} nodes: concept (anatomie), paragraph, concept (pasaj disectat), steps (5), think, recall (2 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Anatomy of an LSAT Argument
  Block:  ${result.data?.id}
  Nodes:  ${L3_1_CONTENT.length}

  View at: http://localhost:5173/lessons/lsat-argument-anatomy
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

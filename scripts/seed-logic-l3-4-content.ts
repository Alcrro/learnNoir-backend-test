/**
 * Seed: L3.4 — Flaw in Reasoning Questions (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l3-4-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock and DragSortNode are algorithm-only.
 * - example -> concept block cu 3 argumente analizate
 * - drag-sort -> fill-blanks: 5 argumente, completezi tipul de flaw
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

const L3_4_CONTENT = [
  // 1. concept -- Ce cauta un flaw question
  {
    type: "concept",
    title: "Ce cauta un Flaw in Reasoning question",
    sections: [
      {
        label: "Tipuri de flaws frecvente in LSAT",
        text: "Correlation vs causation: trateaza o corelatie ca dovada a cauzalitatii. Esantion nereprezentativ: generalizeaza dintr-un grup care nu reflecta populatia totala. False dichotomy: prezinta doar doua optiuni ignorand altele. Ad hominem: ataca persoana nu argumentul. Circular reasoning: foloseste concluzia ca premisa. Confundarea necesarului cu suficientul: presupune ca o conditie necesara este si suficienta. Analogie defectuoasa: compara situatii semnificativ diferite.",
      },
      {
        label: "Limbajul specific din variantele de raspuns LSAT",
        text: "Variantele de raspuns la flaw questions folosesc un limbaj abstract standardizat: \"takes for granted that...\", \"confuses correlation with causation\", \"draws a conclusion from an unrepresentative sample\", \"presents only two alternatives when others exist\", \"mistakes a necessary condition for a sufficient one\". Trebuie sa inveti sa mapezi acest limbaj abstract la structura concreta a argumentului din pasaj.",
      },
      {
        label: "Strategia",
        text: "Pasul 1: Identifica concluzia si premisele. Pasul 2: Gaseste saltul logic -- ce presupune argumentul fara sa demonstreze? Pasul 3: Numeste flaw-ul in termeni proprii inainte sa citesti variantele. Pasul 4: Cauta varianta al carei limbaj abstract descrie exact saltul identificat. Greseala frecventa: alegerea variantei care mentioneaza un adevar general despre subiect in loc sa descrie defectul structural al argumentului.",
      },
    ],
  },

  // 2. concept -- 3 argumente cu flaws diferite (inlocuieste example)
  {
    type: "concept",
    title: "3 argumente LSAT cu flaws diferite -- analiza completa",
    sections: [
      {
        label: "Flaw 1: Correlation vs causation",
        text: "Pasaj: \"In orasele cu mai multe librarii per capita, rata criminalitatii este semnificativ mai mica. Prin urmare, incurajarea lecturii reduce criminalitatea.\" Flaw: concluzia presupune ca mai multe librarii cauzeaza criminalitate mai mica, dar corelația poate fi explicata printr-o variabila terță -- nivelul educatiei sau veniturile medii. Descriere LSAT: \"takes for granted that a correlation between two factors establishes that one causes the other.\" Variante incorecte tipice: \"ignora faptul ca bibliotecile sunt mai ieftine decat librariile\" -- nu descrie flaw-ul structural.",
      },
      {
        label: "Flaw 2: Esantion nereprezentativ",
        text: "Pasaj: \"Am intervievat 60 de studenti de la Facultatea de Drept din Bucuresti si 75% sustin ca programul de studiu este prea incarcat. Deci, studentii la drept din Romania considera ca programul este prea incarcat.\" Flaw: 60 de studenti dintr-o singura facultate nu sunt reprezentativi pentru toti studentii la drept din Romania -- pot fi diferente majore intre universitati, orase, ani de studiu. Descriere LSAT: \"draws a conclusion about a population based on a sample that may not be representative.\"",
      },
      {
        label: "Flaw 3: False dichotomy",
        text: "Pasaj: \"Fie adoptam imediat masuri drastice de reducere a emisiilor de carbon, fie planeta va deveni nelocuibila in 50 de ani. Guvernul nu a adoptat masuri drastice. Deci, planeta va deveni nelocuibila.\" Flaw: premisa majora exclude optiuni intermediare -- masuri moderate, tehnologii de captare a carbonului, adaptare climatica, timeline diferit. Descriere LSAT: \"presents only two alternatives when there may be others, and concludes one must occur because the other is absent.\"",
      },
    ],
  },

  // 3. recall -- 4 MCQ pe identificarea flaw-ului
  {
    type: "recall",
    questions: [
      {
        question: "\"Compania Y a inceput sa foloseasca software de management al proiectelor in ianuarie. In urmatoarele sase luni, productivitatea a crescut cu 15%. Deci, software-ul a cauzat cresterea productivitatii.\" Ce flaw contine argumentul?",
        options: [
          "Esantion nereprezentativ -- sase luni nu sunt suficiente.",
          "Trateaza o corelatie temporala ca dovada a cauzalitatii, ignorand alti factori.",
          "False dichotomy -- presupune ca fie software-ul, fie nimic nu a cauzat cresterea.",
          "Ad hominem -- ataca credibilitatea companiei Y.",
        ],
        correct: 1,
      },
      {
        question: "\"Toti medicii intervievati la conferinta internationala de cardiologie sustin ca pacientii ar trebui sa consume mai putin sare. Deci, medicii in general recomanda reducerea consumului de sare.\" Ce flaw contine argumentul?",
        options: [
          "Circular reasoning -- medicii sunt definiti prin recomandari.",
          "False dichotomy -- ignora medicii care nu au opinie.",
          "Esantion nereprezentativ -- medicii de la o conferinta de cardiologie nu reprezinta toti medicii.",
          "Correlation vs causation -- sarea nu cauzeaza neaparat probleme.",
        ],
        correct: 2,
      },
      {
        question: "In LSAT, varianta corecta la o intrebare de flaw descrie intotdeauna:",
        options: [
          "Un adevar general despre subiectul argumentului.",
          "Defectul structural al argumentului -- saltul logic specific dintre premise si concluzie.",
          "O informatie suplimentara care ar putea schimba concluzia.",
          "Motivul pentru care premisele sunt false.",
        ],
        correct: 1,
      },
      {
        question: "\"Medicamentul a functionat la toti cei 5 pacienti testati. Deci, este eficient pentru intreaga populatie.\" Varianta care descrie corect flaw-ul este:",
        options: [
          "\"Presupune ca ceea ce este adevarat pentru o parte este adevarat pentru intregul, fara sa verifice reprezentativitatea esantionului.\"",
          "\"Concluzia este adevarata deoarece medicamentul a functionat.\"",
          "\"Ignora faptul ca medicamentele pot avea efecte secundare.\"",
          "\"Trateaza o conditie suficienta ca si cum ar fi necesara.\"",
        ],
        correct: 0,
      },
    ],
  },

  // 4. fill-blanks -- 5 argumente, identifica flaw-ul (inlocuieste drag-sort)
  {
    type: "fill-blanks",
    title: "Identifica flaw-ul fiecarui argument",
    language: "text",
    content: "1. \"De cand noul CEO a preluat compania, profiturile au scazut. El este responsabil pentru declin.\"  ->  {{0}}\n2. \"Nu poti lua in serios propunerile economice ale senatorului -- el a dat faliment de doua ori.\"  ->  {{1}}\n3. \"Fie sustii cresterea bugetului pentru aparare, fie esti impotriva securitatii nationale.\"  ->  {{2}}\n4. \"Toti colegii mei de birou beau cafea dimineata. Deci, toti angajatii din companie beau cafea.\"  ->  {{3}}\n5. \"Programul este corect deoarece a fost aprobat de experti, iar expertii aproba doar programe corecte.\"  ->  {{4}}",
    blanks: [
      {
        id: 0,
        options: ["correlation vs causation", "ad hominem", "false dichotomy"],
        correct: "correlation vs causation",
      },
      {
        id: 1,
        options: ["circular reasoning", "ad hominem", "esantion nereprezentativ"],
        correct: "ad hominem",
      },
      {
        id: 2,
        options: ["false dichotomy", "correlation vs causation", "circular reasoning"],
        correct: "false dichotomy",
      },
      {
        id: 3,
        options: ["esantion nereprezentativ", "false dichotomy", "ad hominem"],
        correct: "esantion nereprezentativ",
      },
      {
        id: 4,
        options: ["circular reasoning", "correlation vs causation", "esantion nereprezentativ"],
        correct: "circular reasoning",
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
    `lessons?title=eq.${encodeURIComponent("Flaw in Reasoning")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Flaw in Reasoning\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L3_4_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L3_4_CONTENT.length} nodes: concept, concept (3 argumente), recall (4 MCQ), fill-blanks (5 argumente)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Flaw in Reasoning
  Block:  ${result.data?.id}
  Nodes:  ${L3_4_CONTENT.length}

  View at: http://localhost:5173/lessons/flaw-in-reasoning
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

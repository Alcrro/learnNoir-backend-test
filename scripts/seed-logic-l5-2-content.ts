/**
 * Seed: L5.2 — Evaluating Evidence (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l5-2-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; arguments use concept block.
 * DragSortNode is algorithm-only; evidence ranking uses fill-blanks.
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

const L5_2_CONTENT = [
  // 1. concept -- Criterii pentru dovezi solide
  {
    type: "concept",
    title: "Criterii pentru dovezi solide -- cum evaluezi calitatea unei dovezi",
    sections: [
      {
        label: "Relevanta",
        text: "O dovada este relevanta daca are o legatura directa cu concluzia argumentului. Testul: daca dovada ar fi eliminata, ar fi mai greu de sustinut concluzia? Daca nu, dovada e irelevanta. Eroarea frecventa: dovezi care par legate de subiect dar nu ating concluzia specifica. Exemplu: pentru concluzia \"programul X reduce criminalitatea\", statistica despre cresterea economica in zona e irelevanta -- nu atinge direct mecanismul criminalitate-program.",
      },
      {
        label: "Suficienta",
        text: "O dovada este suficienta daca, singura sau impreuna cu alte dovezi, justifica concluzia. Testul: exista alternative plauzibile care ar explica dovada fara ca concluzia sa fie adevarata? Dovada insuficienta: un singur caz, o singura observatie, un anecdot. Dovada mai suficienta: studii controlate, date longitudinale, meta-analize. Regula practica: cu cat concluzia e mai ampla (\"toti\", \"intotdeauna\", \"cea mai buna\"), cu atat dovada trebuie sa fie mai robusta.",
      },
      {
        label: "Reprezentativitatea",
        text: "O dovada e reprezentativa daca esantionul din care provine reflecta populatia despre care se face concluzia. Semnale de probleme: esantion mic, esantion selectat nealeator, esantion dintr-un singur context geographic sau temporal, esantion auto-selectat (voluntari). Exemplu problematic: sondaj de satisfactie completat doar de clientii care au reactionat voluntar -- over-reprezinta extremele (foarte multumiti sau foarte nemultumiti).",
      },
      {
        label: "Sursa",
        text: "Sursa unei dovezi afecteaza credibilitatea ei. Intrebari cheie: sursa are expertiza in domeniu? Sursa are conflict de interese (finantare de la parti interesate in rezultat)? Dovada a fost publicata intr-un context peer-reviewed sau e doar o declaratie? Dovada e recenta sau datele sunt vechi intr-un domeniu care evolueaza rapid? Sursa cu conflict de interese nu invalideaza automat dovada, dar creste sarcina probei -- ai nevoie de confirmari independente.",
      },
    ],
  },

  // 2. concept -- 4 argumente cu dovezi de calitati diferite (inlocuieste example)
  {
    type: "concept",
    title: "4 argumente -- analiza metodica a calitatii dovezilor",
    sections: [
      {
        label: "Argumentul 1 -- dovada irelevanta",
        text: "Argument: \"Compania noastra ar trebui sa investeasca in rebranding. Studiile arata ca brandurile puternice au o valoare de piata mai mare.\" Analiza: dovada (branduri puternice = valoare mai mare) nu raspunde la intrebarea cheie -- VA DEVENI brandul nostru mai puternic in urma rebrandingului? Dovada e despre corelatie intre brand puternic si valoare, nu despre efectul unui rebranding. Irelevanta pentru concluzia specifica.",
      },
      {
        label: "Argumentul 2 -- dovada insuficienta (anecdot)",
        text: "Argument: \"Suplimentul Z imbunatateste memoria. Bunica mea il ia de 6 luni si spune ca isi aminteste mai bine lucrurile.\" Analiza: dovada e un singur caz (n=1), subiectiva (auto-raportata), fara grup de control, susceptibila la efectul placebo. Concluzia generala (\"imbunatateste memoria\") nu poate fi sustinuta de un singur anecdot. Dovada insuficienta.",
      },
      {
        label: "Argumentul 3 -- esantion nereprezentativ",
        text: "Argument: \"Studentii romani sunt interesati de antreprenoriat. Un sondaj aplicat la 500 de participanti la o conferinta de startup-uri din Bucuresti arata ca 85% considera antreprenoriatul o cariera atractiva.\" Analiza: esantionul e auto-selectat -- oamenii care merg la conferinte de startup-uri sunt prin definitie interesati de antreprenoriat. Rezultatul nu poate fi generalizat la \"studentii romani\" in ansamblu. Reprezentativitate slaba.",
      },
      {
        label: "Argumentul 4 -- sursa cu conflict de interese",
        text: "Argument: \"Consumul de zahar nu cauzeaza obezitate. Un studiu publicat de Asociatia Industriei Zaharului in 1967 a concluzionat ca grasimile saturate, nu zaharul, sunt principalul factor.\" Analiza: sursa (industria zaharului) are un conflict de interese direct in rezultatul studiului. Studii ulterioare independente au aratat ca industria a platit cercetatori pentru a devia atentia. Sursa cu conflict de interese sever; dovada necesita confirmare independenta.",
      },
    ],
  },

  // 3. steps -- Checklist evaluare dovezi
  {
    type: "steps",
    steps: [
      {
        title: "Este dovada relevanta pentru concluzie?",
        content: [
          {
            type: "paragraph",
            text: "Intreaba: daca aceasta dovada ar fi eliminata, ar fi mai greu de sustinut concluzia? Daca raspunsul e nu, dovada e irelevanta si nu conteaza cat de impresionanta pare. Fii atent la dovezi care ating subiectul in general dar nu concluzia specifica.",
          },
        ],
      },
      {
        title: "Este dovada suficienta (sau e doar o singura instanta)?",
        content: [
          {
            type: "paragraph",
            text: "Verifica: concluzia este sustinuta de date multiple si independente, sau de un singur caz / anecdot? Cu cat concluzia e mai larga (\"toti\", \"intotdeauna\"), cu atat e nevoie de mai multa dovada. Un studiu controlat e mai solid decat o observatie; o meta-analiza e mai solida decat un studiu.",
          },
        ],
      },
      {
        title: "Este esantionul reprezentativ pentru populatia din concluzie?",
        content: [
          {
            type: "paragraph",
            text: "Identifica: din ce populatie vine esantionul si pentru ce populatie se face concluzia. Daca concluzia vorbeste despre \"toti angajatii\" dar dovada vine de la \"angajatii dintr-o singura companie\", exista o problema de reprezentativitate. Esantioanele auto-selectate (voluntari, sondaje online optionale) sunt aproape intotdeauna nereprezentative.",
          },
        ],
      },
      {
        title: "Sursa are expertiza si este libera de conflict de interese?",
        content: [
          {
            type: "paragraph",
            text: "Verifica: cine a produs dovada si ce interes ar putea avea in rezultat? O sursa cu conflict de interese nu invalideaza automat dovada, dar reduce credibilitatea -- cauta confirmari independente. Expertiza conteaza: o opinie medicala dintr-un studiu peer-reviewed are alta greutate decat o opinie exprimata pe un forum.",
          },
        ],
      },
    ],
  },

  // 4. fill-blanks -- identifica problema fiecarei dovezi (inlocuieste drag-sort)
  {
    type: "fill-blanks",
    title: "Identifica principala slabiciune a fiecarei dovezi",
    language: "text",
    content: "Concluzie: \"Programul de fitness al companiei imbunatateste sanatatea angajatilor.\"\n\n1. \"CEO-ul companiei spune ca se simte mai bine de cand face sport.\"  ->  {{0}}\n2. \"Un studiu finantat de producatorul de echipamente de fitness arata beneficii semnificative.\"  ->  {{1}}\n3. \"85% din angajatii care au participat voluntar la sondaj au raportat imbunatatiri.\"  ->  {{2}}\n4. \"Studii din anii 1980 arata ca programele de fitness la locul de munca sunt benefice.\"  ->  {{3}}\n5. \"Angajatii firmei X din Tokyo au beneficiat de pe urma unui program similar.\"  ->  {{4}}",
    blanks: [
      {
        id: 0,
        options: ["dovada insuficienta -- un singur caz, subiectiv", "sursa cu conflict de interese", "esantion nereprezentativ"],
        correct: "dovada insuficienta -- un singur caz, subiectiv",
      },
      {
        id: 1,
        options: ["sursa cu conflict de interese", "dovada irelevanta", "esantion nereprezentativ"],
        correct: "sursa cu conflict de interese",
      },
      {
        id: 2,
        options: ["esantion nereprezentativ -- auto-selectat, doar participantii voluntari", "dovada insuficienta", "sursa cu conflict de interese"],
        correct: "esantion nereprezentativ -- auto-selectat, doar participantii voluntari",
      },
      {
        id: 3,
        options: ["dovada depasita -- domeniul s-a schimbat, date vechi", "dovada irelevanta", "esantion nereprezentativ"],
        correct: "dovada depasita -- domeniul s-a schimbat, date vechi",
      },
      {
        id: 4,
        options: ["esantion nereprezentativ -- context geographic si cultural diferit", "dovada irelevanta", "sursa cu conflict de interese"],
        correct: "esantion nereprezentativ -- context geographic si cultural diferit",
      },
    ],
  },

  // 5. recall -- 3 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Care dintre urmatoarele este semnalul principal ca o dovada e IRELEVANTA pentru o concluzie?",
        options: [
          "Dovada provine dintr-un studiu vechi.",
          "Eliminarea dovezii nu ar face mai greu de sustinut concluzia specifica.",
          "Dovada e produsa de o sursa cu conflict de interese.",
          "Esantionul din care provine dovada este mic.",
        ],
        correct: 1,
      },
      {
        question: "Argument: \"Vaccinul Y e sigur. 200 de pacienti dintr-un singur spital au primit vaccinul si nu au raportat efecte adverse majore.\" Ce problema principala are aceasta dovada?",
        options: [
          "Sursa are conflict de interese.",
          "Dovada e irelevanta pentru concluzia despre siguranta.",
          "Esantionul e insuficient si dintr-un singur context -- nu poate sustine o concluzie generala despre siguranta.",
          "Dovada este prea recenta pentru a fi credibila.",
        ],
        correct: 2,
      },
      {
        question: "O sursa cu conflict de interese inseamna ca dovada pe care o produce este automat falsa?",
        options: [
          "Da -- conflictul de interese invalideaza orice concluzie.",
          "Nu -- conflictul de interese reduce credibilitatea si creste nevoia de confirmare independenta, dar nu invalideaza automat dovada.",
          "Da -- datele finantate de industrie nu pot fi folosite in argumente.",
          "Nu -- conflictul de interese nu are niciun impact asupra calitatii dovezii.",
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
    `lessons?title=eq.${encodeURIComponent("Evaluating Evidence")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Evaluating Evidence\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L5_2_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L5_2_CONTENT.length} nodes: concept (4 criterii), concept (4 argumente), steps (4), fill-blanks (5 dovezi), recall (3 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Evaluating Evidence
  Block:  ${result.data?.id}
  Nodes:  ${L5_2_CONTENT.length}

  View at: http://localhost:5173/lessons/evaluating-evidence
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

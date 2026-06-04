/**
 * Seed: L1.4 — Common Logical Fallacies (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l1-4-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; "examples" use concept blocks instead.
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
    console.error(`POST ${path} → ${res.status}`, json);
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

const L1_4_CONTENT = [
  // 1. concept — Ce este o eroare logică
  {
    type: "concept",
    title: "Ce este o eroare logică (logical fallacy)",
    sections: [
      {
        label: "Definiție",
        text: "O eroare logică este un defect în structura sau conținutul unui argument care îl face invalid sau înșelător. Argumentul poate părea convingător la prima vedere, dar dacă îi analizezi structura, vei găsi un salt logic, o premisă falsă implicată sau o tehnică retorică care nu are valoare logică.",
      },
      {
        label: "De ce e important să le recunoști",
        text: "În LSAT și GMAT, întrebările de tip \"Flaw in Reasoning\" și \"Weaken\" cer să identifici exact eroarea dintr-un argument. Răspunsurile corecte descriu adesea eroarea în limbaj abstract (\"treats correlation as causation\", \"overlooks an alternative explanation\"). Dacă nu știi să recunoști erorile, nu vei putea potrivi descrierea cu argumentul.",
      },
      {
        label: "Cum apar în texte reale",
        text: "Erorile logice apar în editoriale, discursuri politice, reclame și dezbateri. Autorii nu le comit întotdeauna intenționat — uneori sunt rezultatul gândirii rapide sau al presupunerilor implicite. În contextul testelor standardizate, erorile sunt deliberat construite pentru a testa dacă le poți identifica.",
      },
    ],
  },

  // 2. heading — Cele mai frecvente în LSAT/GMAT
  {
    type: "heading",
    text: "Cele mai frecvente erori în LSAT/GMAT",
    level: 2,
  },

  // 3. steps — 7 fallacies cu definiție + exemplu
  {
    type: "steps",
    steps: [
      {
        title: "Ad hominem",
        content: [
          {
            type: "paragraph",
            text: "Atacă persoana care face argumentul, nu argumentul în sine. Exemplu: \"Nu ar trebui să-l asculți pe Ion despre politica fiscală — el nu și-a plătit taxele la timp.\" Greșeala: comportamentul personal al lui Ion nu are nicio relevanță pentru validitatea argumentului său fiscal.",
          },
        ],
      },
      {
        title: "Straw man",
        content: [
          {
            type: "paragraph",
            text: "Deformează poziția adversarului pentru a o face mai ușor de atacat. Exemplu: \"Oponentul meu susține că reducem cheltuielile militare — vrea să lăsăm țara fără apărare.\" Greșeala: reducerea cheltuielilor ≠ desființarea armatei; argumentul atacat nu e cel original.",
          },
        ],
      },
      {
        title: "False dichotomy (either/or)",
        content: [
          {
            type: "paragraph",
            text: "Prezintă doar două opțiuni când există și altele. Exemplu: \"Fie ești cu noi, fie ești împotriva noastră.\" Greșeala: există și poziții intermediare — neutralitate, dezacord parțial, ignoranță față de problemă. Forțarea unei alegeri binare elimină artificial nuanța.",
          },
        ],
      },
      {
        title: "Circular reasoning (begging the question)",
        content: [
          {
            type: "paragraph",
            text: "Concluzia este folosită ca premisă. Exemplu: \"Biblia este adevărată deoarece este Cuvântul lui Dumnezeu, iar noi știm că e Cuvântul lui Dumnezeu pentru că Biblia ne spune asta.\" Greșeala: argumentul se bazează pe ceea ce încearcă să demonstreze — nu adaugă nicio evidență externă.",
          },
        ],
      },
      {
        title: "Correlation vs causation",
        content: [
          {
            type: "paragraph",
            text: "Tratează o corelație statistică ca dovadă a unei relații cauză-efect. Exemplu: \"Vânzările de înghețată și numărul de înecuri cresc în același timp — înghețata cauzează înecuri.\" Greșeala: ambele sunt cauzate de o variabilă terță (vara), nu există relație cauzală directă.",
          },
        ],
      },
      {
        title: "Hasty generalization",
        content: [
          {
            type: "paragraph",
            text: "Trage o concluzie generală dintr-un eșantion insuficient sau nereprezentativ. Exemplu: \"Am întâlnit trei turiști francezi nepoliticoși — francezii sunt nepoliticoși.\" Greșeala: trei cazuri nu sunt suficiente pentru o generalizare despre milioane de oameni; eșantionul poate fi distorsionat.",
          },
        ],
      },
      {
        title: "Appeal to authority",
        content: [
          {
            type: "paragraph",
            text: "Folosește opinia unei autorități ca dovadă, chiar dacă autoritatea nu este relevantă sau expertiza ei nu acoperă domeniul discutat. Exemplu: \"Acest jucător de fotbal recomandă suplimentul X, deci trebuie să fie eficient.\" Greșeala: expertiza în fotbal nu conferă competență medicală sau farmacologică.",
          },
        ],
      },
    ],
  },

  // 4. concept — 3 argumente cu erori analizate (înlocuiește example)
  {
    type: "concept",
    title: "Argumente cu erori — analiză pas cu pas",
    sections: [
      {
        label: "Argumentul 1",
        text: "\"De când noul director a preluat conducerea companiei, profiturile au scăzut cu 20%. Este clar că el a cauzat această scădere.\" — Eroare: Correlation vs causation. Scăderea profiturilor coincide temporal cu numirea directorului, dar nu există dovezi că el a cauzat-o. Pot exista factori externi: recesiune, concurență nouă, schimbări legislative. Un argument valid ar trebui să excludă explicațiile alternative.",
      },
      {
        label: "Argumentul 2",
        text: "\"Senatorul Jones propune limitarea cheltuielilor pentru educație. Nu ar trebui să-l luăm în serios — el însuși a abandonat liceul la 16 ani.\" — Eroare: Ad hominem. Trecutul educațional al senatorului nu are nicio relevanță pentru calitatea propunerii sale legislative. Argumentul trebuie evaluat pe meritul său, nu prin prisma biografiei autorului.",
      },
      {
        label: "Argumentul 3",
        text: "\"Guvernul trebuie să aleagă: fie investim masiv în energie nucleară, fie rămânem dependenți de combustibili fosili.\" — Eroare: False dichotomy. Există numeroase alternative ignorate: energie solară, eoliană, hidro, geotermală, eficiență energetică, mix de surse. Prezentarea a doar două opțiuni forțează o alegere artificială și elimină soluțiile mai nuanțate.",
      },
    ],
  },

  // 5. recall — 5 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "\"Nu poți lua în serios argumentele Mariei pentru dieta vegană — ea a fost surprinsă mâncând un hamburger luna trecută.\" Ce eroare logică apare?",
        options: [
          "Straw man",
          "Ad hominem",
          "Hasty generalization",
          "Appeal to authority",
        ],
        correct: 1,
      },
      {
        question: "\"Studiile arată că orașele cu mai mulți medici au rate mai mari ale mortalității. Deci medicii cauzează decese.\" Ce eroare logică apare?",
        options: [
          "Circular reasoning",
          "False dichotomy",
          "Correlation vs causation",
          "Ad hominem",
        ],
        correct: 2,
      },
      {
        question: "\"Fie susții creșterea bugetului pentru poliție, fie ești pentru criminalitate.\" Ce eroare logică apare?",
        options: [
          "Straw man",
          "Appeal to authority",
          "Hasty generalization",
          "False dichotomy",
        ],
        correct: 3,
      },
      {
        question: "\"Politica economică a candidatului este greșită deoarece candidatul însuși spune că politica sa este corectă și candidatul nu greșește niciodată.\" Ce eroare logică apare?",
        options: [
          "Ad hominem",
          "Circular reasoning",
          "Correlation vs causation",
          "Straw man",
        ],
        correct: 1,
      },
      {
        question: "\"Am intervievat 5 studenți din prima bancă și toți au luat note mari. Deci studenții care stau în prima bancă sunt mai inteligenți.\" Ce eroare logică apare?",
        options: [
          "Appeal to authority",
          "False dichotomy",
          "Hasty generalization",
          "Circular reasoning",
        ],
        correct: 2,
      },
    ],
  },

  // 6. think — Identifică o eroare din viața reală
  {
    type: "think",
    question: "Găsește o eroare logică într-un argument pe care l-ai auzit recent — dintr-o reclamă, știre, discuție politică sau conversație. Identifică: (1) argumentul complet, (2) tipul de eroare, (3) de ce este o eroare.",
    reveal: "Exemple frecvente în media: reclame care folosesc vedete pentru a recomanda produse medicale (appeal to authority), editoriale care prezintă politici complexe ca alegeri binare (false dichotomy), știri care leagă două fenomene corelate fără a demonstra cauzalitatea (correlation vs causation). Exercițiul este valoros pentru că erorile logice sunt mult mai ușor de recunoscut în argumente proprii față de argumentele din teste — diferența de context crește dificultatea.",
  },
];

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n── Auth ─────────────────────────────────────────────────");

  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: SEED_EMAIL, password: SEED_PASS }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
  await loginRes.json();
  const rawCookies = loginRes.headers.getSetCookie?.() ?? [];
  const cookieHeader = rawCookies.map((c) => c.split(";")[0]).join("; ");
  console.log("  ✓ Logged in");

  console.log("\n── Lesson lookup ────────────────────────────────────────");

  const lessons = await supabaseGet(
    `lessons?title=eq.${encodeURIComponent("Common Logical Fallacies")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error('Lesson "Common Logical Fallacies" not found — run seed-logic-subject.ts first');
  }
  const lessonId = lessons[0]!.id as string;
  console.log(`  ✓ Found lesson: ${lessons[0]!.title} (${lessonId})`);

  console.log("\n── Content block check ──────────────────────────────────");

  const existingBlocks = await supabaseGet(
    `lesson_blocks?lesson_id=eq.${lessonId}&type=eq.content&select=id`,
  );
  if (existingBlocks.length > 0) {
    console.log(`  ~ Content block already exists (${existingBlocks[0]!.id}) — skipping.`);
    console.log("\n── Done (no changes) ────────────────────────────────────\n");
    return;
  }

  console.log("\n── Creating content block ───────────────────────────────");

  const result = await post(
    "/lessons-block",
    {
      lessonId,
      type: "content",
      data: { content: L1_4_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  ✓ Content block created (${result.data?.id})`);
  console.log(`  ✓ ${L1_4_CONTENT.length} nodes: concept, heading, steps (7), concept, recall (5 MCQ), think`);

  console.log(`
── Done ─────────────────────────────────────────────────

  Lesson: Common Logical Fallacies
  Block:  ${result.data?.id}
  Nodes:  ${L1_4_CONTENT.length}

  View at: http://localhost:5173/lessons/logical-fallacies
`);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message);
  process.exit(1);
});

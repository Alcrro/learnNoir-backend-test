/**
 * Seed: L2.1 — Intro to Logic Grids (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l2-1-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; grid walkthrough uses concept block.
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

const L2_1_CONTENT = [
  // 1. concept — Ce este un logic grid
  {
    type: "concept",
    title: "Ce este un logic grid",
    sections: [
      {
        label: "Format",
        text: "Un logic grid este un puzzle de deducție în care trebuie să potrivești un set de entități (persoane, obiecte) cu atributele lor (profesii, culori, poziții) folosind exclusiv condițiile date. Formatul standard: N persoane × N atribute × M condiții, unde M ≥ N. Fiecare persoană are exact un atribut din fiecare categorie, și fiecare atribut aparține exact unei persoane.",
      },
      {
        label: "Cum se completează",
        text: "Grila are rânduri (persoane) și coloane (atribute). Fiecare celulă poate fi: ✓ (confirmat), ✗ (exclus), sau goală (necunoscut). Scopul: completează toate celulele cu ✓ sau ✗ până când fiecare rând și fiecare coloană au exact un ✓.",
      },
      {
        label: "Regula de bază",
        text: "Toate concluziile trebuie să decurgă strict din condițiile date — nicio ghicire, nicio intuiție. Dacă nu poți demonstra o celulă din condiții, lasă-o goală și continuă cu altă celulă. Un logic grid corect rezolvat are o soluție unică determinabilă pur deductiv.",
      },
    ],
  },

  // 2. heading
  {
    type: "heading",
    text: "Metodă pas cu pas",
    level: 2,
  },

  // 3. steps — 4 pași
  {
    type: "steps",
    steps: [
      {
        title: "Citește toate condițiile înainte să completezi ceva",
        content: [
          {
            type: "paragraph",
            text: "Parcurge toate condițiile o dată, fără să marchezi nimic. Unele condiții devin utile abia după ce alte celule sunt completate. Grăbindu-te să aplici prima condiție izolat, poți rata deducțiile care necesită combinarea mai multor condiții.",
          },
        ],
      },
      {
        title: "Marchează ce este sigur din condiții directe",
        content: [
          {
            type: "paragraph",
            text: "Aplică condițiile care dau informație directă: \"X nu este Y\" → ✗ în celula (X, Y). \"X este Y\" → ✓ în celula (X, Y) și ✗ pe tot rândul X și pe toată coloana Y. Condițiile directe sunt punctul de pornire al oricărei rezolvări.",
          },
        ],
      },
      {
        title: "Elimină prin contradicție și deducție",
        content: [
          {
            type: "paragraph",
            text: "Dacă pe un rând există un singur spațiu gol, acea celulă trebuie să fie ✓. Dacă pe o coloană toate celulele sunt ✗ în afară de una, acea celulă trebuie să fie ✓. Combină condiții: dacă A ≠ X și B ≠ X și există 3 persoane, atunci C = X.",
          },
        ],
      },
      {
        title: "Repetă până când grila este completă",
        content: [
          {
            type: "paragraph",
            text: "Fiecare celulă completată poate debloca noi deducții în altă parte a grilei. Parcurge condițiile din nou după fiecare ciclu de completare. Dacă te blochezi, re-citește condițiile — de obicei există o condiție combinată pe care nu ai aplicat-o încă.",
          },
        ],
      },
    ],
  },

  // 4. concept — Grid 3×3 rezolvat integral pas cu pas (înlocuiește example)
  {
    type: "concept",
    title: "Exemplu rezolvat: Grid 3×3",
    sections: [
      {
        label: "Setup",
        text: "Persoane: Ana, Bogdan, Carmen. Profesii: Doctor, Avocat, Inginer. Condiții: (C1) Ana nu este doctor. (C2) Bogdan este avocat sau inginer. (C3) Carmen nu este avocat. (C4) Bogdan nu este inginer.",
      },
      {
        label: "Pasul 1 — Aplică C4",
        text: "C4: Bogdan ≠ Inginer → marchează ✗ în (Bogdan, Inginer). Grila: Ana: ?, ?, ? | Bogdan: ?, ?, ✗ | Carmen: ?, ?, ?",
      },
      {
        label: "Pasul 2 — Combină C2 și C4",
        text: "C2: Bogdan = Avocat SAU Inginer. C4: Bogdan ≠ Inginer. Concluzie: Bogdan = Avocat (singura opțiune rămasă). Marchează ✓ în (Bogdan, Avocat) și ✗ în (Bogdan, Doctor), ✗ în (Ana, Avocat), ✗ în (Carmen, Avocat).",
      },
      {
        label: "Pasul 3 — Aplică C3 (deja rezolvată)",
        text: "C3: Carmen ≠ Avocat → ✗ în (Carmen, Avocat). Deja marcat la pasul anterior. Carmen rămâne cu Doctor sau Inginer.",
      },
      {
        label: "Pasul 4 — Aplică C1 și finalizează",
        text: "C1: Ana ≠ Doctor → ✗ în (Ana, Doctor). Ana rămâne cu Doctor ✗ și Avocat ✗, deci Ana = Inginer. Marchează ✓ în (Ana, Inginer) și ✗ în (Carmen, Inginer). Carmen = Doctor (singura opțiune rămasă).",
      },
      {
        label: "Soluție finală",
        text: "Ana = Inginer | Bogdan = Avocat | Carmen = Doctor. Verificare: fiecare persoană are exact o profesie ✓, fiecare profesie aparține exact unei persoane ✓. Toate cele 4 condiții sunt satisfăcute ✓.",
      },
    ],
  },

  // 5. predict
  {
    type: "predict",
    question: "Folosind doar condițiile C1 (Ana ≠ Doctor) și C2 (Bogdan = Avocat sau Inginer) din exemplul de mai sus, ce poți deduce cu certitudine despre Carmen — fără să folosești C3 sau C4?",
    answer: "Din C1: Ana ≠ Doctor. Din C2: Bogdan ≠ Doctor (pentru că Bogdan = Avocat sau Inginer). Există 3 persoane și 3 profesii; doctorul trebuie să fie cineva. Ana ≠ Doctor și Bogdan ≠ Doctor → prin eliminare, Carmen = Doctor. Aceasta este o deducție validă doar din C1 și C2, fără C3 și C4.",
  },

  // 6. recall — 3 MCQ pe grila rezolvată
  {
    type: "recall",
    questions: [
      {
        question: "În grila rezolvată din exemplu (Ana, Bogdan, Carmen — Doctor, Avocat, Inginer), care condiție a permis prima deducție certă?",
        options: [
          "C1 (Ana ≠ Doctor) — singură a rezolvat prima persoană.",
          "C3 (Carmen ≠ Avocat) — singură a rezolvat prima persoană.",
          "Combinarea C2 și C4 — a determinat că Bogdan = Avocat.",
          "C4 singură — a rezolvat Bogdan direct.",
        ],
        correct: 2,
      },
      {
        question: "Într-un logic grid, dacă pe un rând toate celulele sunt ✗ în afară de una, ce urmează?",
        options: [
          "Celula rămasă goală poate fi ✓ sau ✗ — nu știm sigur.",
          "Celula rămasă goală trebuie să fie ✓ — este singura opțiune posibilă.",
          "Trebuie să recitim condițiile pentru a confirma.",
          "Grila are o eroare — nu ar trebui să se întâmple asta.",
        ],
        correct: 1,
      },
      {
        question: "De ce nu se recomandă să ghicești o celulă atunci când ești blocat într-un logic grid?",
        options: [
          "Nu există nicio regulă împotriva ghicitului — e o strategie validă.",
          "O ghicire greșită poate propaga erori în cascadă, invalidând deducțiile ulterioare.",
          "Ghicitul funcționează doar în grile 2×2, nu în grile mai mari.",
          "Ghicitul este permis doar dacă confirmi ulterior cu condițiile.",
        ],
        correct: 1,
      },
    ],
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
    `lessons?title=eq.${encodeURIComponent("Intro to Logic Grids")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error('Lesson "Intro to Logic Grids" not found — run seed-logic-subject.ts first');
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
      data: { content: L2_1_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  ✓ Content block created (${result.data?.id})`);
  console.log(`  ✓ ${L2_1_CONTENT.length} nodes: concept, heading, steps (4), concept (grid walkthrough), predict, recall (3 MCQ)`);

  console.log(`
── Done ─────────────────────────────────────────────────

  Lesson: Intro to Logic Grids
  Block:  ${result.data?.id}
  Nodes:  ${L2_1_CONTENT.length}

  View at: http://localhost:5173/lessons/intro-logic-grids
`);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message);
  process.exit(1);
});

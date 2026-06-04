/**
 * Seed: L5.1 — Hidden Assumptions (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l5-1-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; complex arguments use concept block.
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

const L5_1_CONTENT = [
  // 1. concept -- Presupozitiile ca "lipici" intre premise si concluzie
  {
    type: "concept",
    title: "Presupozitiile ascunse -- lipiciul dintre premise si concluzie",
    sections: [
      {
        label: "De ce sunt ascunse",
        text: "O presupunere ascunsa este o afirmatie pe care autorul o considera adevarata fara sa o spuna explicit, si fara de care argumentul nu ar tine. Presupunerile sunt ascunse pentru ca autorul le considera evidente sau nu vrea sa le supuna scrutinului. Ele reprezinta gap-ul logic dintre ce se spune (premisele) si ce se sustine (concluzia). Un argument fara presupuneri ascunse ar trebui sa fie complet deductiv -- fiecare pas ar urma necesar din cel anterior. In practica, aproape orice argument inductiv are cel putin o presupunere.",
      },
      {
        label: "Cum le gasesti sistematic",
        text: "Metoda gap-ului: (1) Scrie premisele. (2) Scrie concluzia. (3) Intreaba: \"Ce ar trebui sa mai fie adevarat pentru ca premisele sa conduca la concluzie?\" Raspunsul este presupunerea ascunsa. Metoda termenilor noi: daca concluzia contine un termen care nu apare in premise, exista o presupunere care leaga acel termen de ce se stie deja. Metoda cauzalitatii: daca argumentul sustine o relatie cauzala bazata pe o corelatie, presupunerea e ca nu exista o explicatie alternativa.",
      },
      {
        label: "Testul negarii aplicat",
        text: "Testul negarii (negation test) este instrumentul standard LSAT/GMAT pentru a verifica daca ai gasit presupunerea corecta: neaga mental presupunerea candidata si verifica daca argumentul se prabuseste. Daca negarea presupunerii distruge sau slabeste semnificativ argumentul, ai gasit o presupunere reala. Daca argumentul tine chiar si cu presupunerea negata, acea presupunere nu era necesara. Exemplu: argument \"X produce Y; deci ar trebui sa facem X.\" Presupunere: \"Y este dezirabil.\" Testul negarii: \"Y nu este dezirabil\" -- argumentul se prabuseste. Presupunere corecta.",
      },
    ],
  },

  // 2. concept -- 3 argumente complexe cu presupuneri (inlocuieste example)
  {
    type: "concept",
    title: "3 argumente complexe -- presupunerile lor ascunse",
    sections: [
      {
        label: "Argumentul 1 -- cu 2 presupuneri",
        text: "Argument: \"Tarile cu sisteme de sanatate publice universale au o speranta de viata mai mare decat tarile fara. Prin urmare, Romania ar trebui sa extinda acoperirea sistemului sau de sanatate.\" Presupunere 1: sistemul universal de sanatate CAUZEAZA speranta de viata mai mare (nu exista factori terti -- nivel de trai, dieta, factori genetici -- care sa explice corelata). Testul negarii P1: daca alti factori explica diferenta, argumentul se prabuseste. Presupunere 2: o speranta de viata mai mare este un obiectiv dezirabil pentru Romania in conditiile actuale (nu exista trade-off-uri inacceptabile -- costuri, calitate redusa, liste de asteptare).",
      },
      {
        label: "Argumentul 2 -- cu 3 presupuneri",
        text: "Argument: \"Angajatii care lucreaza de acasa sunt mai productivi. Compania noastra vrea sa maximizeze productivitatea. Prin urmare, compania noastra ar trebui sa treaca la un model full-remote.\" Presupunere 1: productivitatea masurata in studii se va aplica SI angajatilor acestei companii (nu exista diferente specifice industriei, rolului, sau culturii organizationale). Presupunere 2: maximizarea productivitatii e unicul sau principalul criteriu de decizie -- nu exista alte valori organizationale (colaborare, cultura, mentoring) care ar fi afectate negativ. Presupunere 3: trecerea la full-remote este fezabila si nu are costuri tranzactionale care depasesc castigul de productivitate.",
      },
      {
        label: "Argumentul 3 -- presupunere despre comparabilitate",
        text: "Argument: \"Programul de antrenament al echipei nationale de fotbal a fost modificat anul trecut. De atunci, echipa a castigat 70% din meciuri, fata de 40% inainte. Noul program de antrenament este responsabil pentru imbunatatire.\" Presupunere 1: adversarii din meciurile post-modificare sunt comparabili ca nivel cu cei din meciurile anterioare (nu s-a intamplat sa jucam cu echipe mai slabe). Presupunere 2: nu au existat alte schimbari simultane care sa explice imbunatatirea -- lot de jucatori, antrenori, conditii meteorologice, loterie de meciuri. Presupunere 3: procentul de 70% pe esantionul de dupa modificare este reprezentativ si nu reflecta un esantion mic (daca au jucat doar 10 meciuri, marja de eroare e ridicata).",
      },
    ],
  },

  // 3. predict -- Ce presupune argumentul urmator?
  {
    type: "predict",
    question: "Citeste argumentul si identifica TOATE presupunerile ascunse inainte sa dai reveal:\n\n\"Studiile arata ca elevii care citesc mai mult de 30 de minute pe zi obtin note mai bune. Prin urmare, parintii ar trebui sa impuna o rutina zilnica de citit de cel putin 30 de minute.\"\n\nCe presupune argumentul fara sa spuna explicit?",
    answer: "Presupunere 1: relatia e cauzala, nu de selectie -- elevii care citesc mult nu obtin note mai bune pentru ca sunt oricum mai motivati sau mai inteligenti; ci lectura IN SINE produce imbunatatirea notelor. Presupunere 2: impunerea externa a unei rutine va produce acelasi efect ca lectura voluntara -- nu exista diferenta de impact intre cititul ales si cel obligat. Presupunere 3: 30 de minute este pragul corect pentru orice elev, indiferent de varsta, nivel de lectura, sau disciplina studiata. Presupunere 4: notele mai bune sunt un obiectiv suficient de valoros incat sa justifice impunerea, indiferent de impactul asupra autonomiei copilului sau a altor activitati.",
  },

  // 4. think -- Care presupunere e mai vulnerabila?
  {
    type: "think",
    question: "Din argumentul: \"Companiile care au adoptat saptamana de lucru de 4 zile au raportat o crestere a productivitatii si o scadere a absenteismului. Prin urmare, toate companiile ar trebui sa adopte saptamana de 4 zile.\" -- identifica cel putin doua presupuneri si explica: care dintre ele este mai vulnerabila si de ce?",
  },

  // 5. recall -- 4 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Ce este o presupunere ascunsa intr-un argument?",
        options: [
          "O afirmatie falsa pe care autorul o prezinta ca adevarata.",
          "O afirmatie pe care autorul o considera adevarata fara sa o spuna explicit, si fara de care argumentul nu ar tine.",
          "O concluzie secundara care sustine concluzia principala.",
          "O dovada pe care autorul o omite intentionat.",
        ],
        correct: 1,
      },
      {
        question: "Cum aplici testul negarii pentru a verifica o presupunere?",
        options: [
          "Adaugi \"Nu este adevarat ca...\" in fata concluziei si verifici daca premisele raman valide.",
          "Negi presupunerea candidata si verifici daca argumentul se prabuseste sau se slabeste semnificativ.",
          "Negi toate premisele si verifici daca concluzia ramane adevarata.",
          "Adaugi presupunerea ca premisa explicita si verifici daca argumentul devine circular.",
        ],
        correct: 1,
      },
      {
        question: "Argument: \"Produsele bio costa mai mult. Consumatorii cu venituri mari cumpara mai multe produse bio. Deci, produsele bio sunt un simbol de status.\" Care este presupunerea centrala?",
        options: [
          "Consumatorii cu venituri mari au mai multi bani de cheltuit.",
          "Motivatia principala a cumparatorilor de produse bio este demonstrarea statusului, nu sanatatea sau etica.",
          "Produsele bio sunt mai sanatoase decat cele conventionale.",
          "Pretul unui produs nu afecteaza calitatea sa.",
        ],
        correct: 1,
      },
      {
        question: "Care metoda te ajuta sa gasesti o presupunere atunci cand concluzia contine un termen absent din premise?",
        options: [
          "Testul negarii -- negi concluzia si verifici premisele.",
          "Metoda termenilor noi -- presupunerea leaga termenul nou din concluzie de ce se stie deja din premise.",
          "Metoda cauzalitatii -- cauti o relatie de tip cauza-efect intre premise.",
          "Metoda gap-ului -- scrii premisele si concluzia si intrebi ce lipseste.",
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
    `lessons?title=eq.${encodeURIComponent("Hidden Assumptions")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Hidden Assumptions\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L5_1_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L5_1_CONTENT.length} nodes: concept, concept (3 argumente complexe), predict, think, recall (4 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Hidden Assumptions
  Block:  ${result.data?.id}
  Nodes:  ${L5_1_CONTENT.length}

  View at: http://localhost:5173/lessons/hidden-assumptions
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

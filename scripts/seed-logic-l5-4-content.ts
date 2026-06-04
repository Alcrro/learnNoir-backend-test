/**
 * Seed: L5.4 — Multi-Layer Arguments (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l5-4-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; multi-layer arguments use concept block.
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

const L5_4_CONTENT = [
  // 1. concept -- Structuri complexe de argumente
  {
    type: "concept",
    title: "Argumente multi-strat -- structuri complexe de rationament",
    sections: [
      {
        label: "Lanturile de rationament",
        text: "Un lant de rationament apare atunci cand concluzia unui sub-argument devine premisa pentru urmatorul pas. Structura: P1 + P2 -> C1 (concluzie intermediara) -> C1 + P3 -> C2 (concluzie finala). Fiecare veriga din lant depinde de veriga anterioara. Implicatia critica: daca oricare veriga e falsa sau slaba, intregul lant se rupe. In analiza unui astfel de argument trebuie sa evaluezi fiecare legatura separat, nu doar concluzia finala.",
      },
      {
        label: "Sub-argumentele",
        text: "Un sub-argument este un argument complet (cu premise si concluzie proprii) care serveste drept sustinere pentru un argument mai larg. Argumentele complexe contin adesea 2-3 sub-argumente care converg spre o concluzie finala. Cum le identifici: cauta propozitii care joaca dublu rol -- sunt concluzie a unui set de premise SI premisa pentru concluzia principala. Semnale lingvistice: \"avand in vedere ca...\", \"deoarece... rezulta ca... si deci...\", \"pe de o parte... pe de alta parte... prin urmare...\"",
      },
      {
        label: "Concluzia intermediara vs concluzia finala",
        text: "Concluzia intermediara (sub-concluzie) este sustinuta de un set de premise si, la randul ei, sustine concluzia finala. Concluzia finala este propozitia pe care intregul argument o sustine in ultima instanta. Cum le diferentiezi: concluzia intermediara raspunde la \"ce demonstreaza aceste prime premise?\"; concluzia finala raspunde la \"ce vrea autorul sa demonstreze in final?\". Testul: o concluzie intermediara poate fi la randul ei pusa sub semnul intrebarii independent de concluzia finala.",
      },
    ],
  },

  // 2. concept -- 2 argumente multi-strat disecate (inlocuieste example)
  {
    type: "concept",
    title: "2 argumente multi-strat -- disectie completa cu diagrama textuala",
    sections: [
      {
        label: "Argumentul 1 -- lant de rationament in 3 etape",
        text: "Text: \"Scolile care folosesc metode de invatare activa au elevi mai angajati. Elevii mai angajati invata mai eficient. Prin urmare, invatarea activa produce o invatare mai eficienta. In plus, invatarea eficienta duce la rezultate mai bune la examene. Deci, scolile ar trebui sa adopte metode de invatare activa pentru a imbunatati rezultatele la examene.\" Diagrama structurii: [P1: invatare activa -> elevi angajati] + [P2: elevi angajati -> invatare eficienta] -> [C1 (intermediara): invatare activa -> invatare eficienta] + [P3: invatare eficienta -> rezultate mai bune] -> [C2 (finala): scolile sa adopte invatarea activa]. Vulnerabilitati: veriga P1->C1 presupune ca angajamentul e cauza, nu efectul; veriga C1->C2 presupune ca rezultatele la examene sunt masura corecta a eficientei invatarii.",
      },
      {
        label: "Argumentul 2 -- doua sub-argumente convergente",
        text: "Text: \"Sub-argumentul A: Poluarea aerului in orasele mari depaseste limitele OMS. Depasirea limitelor OMS e asociata cu cresterea morbiditatii respiratorii. Deci, poluarea urbana afecteaza sanatatea populatiei. Sub-argumentul B: Transportul in comun electric reduce emisiile de particule fine cu 40% fata de transportul privat cu combustie. Reducerea particulelor fine scade direct poluarea aerului. Deci, extinderea transportului in comun electric reduce poluarea. Concluzia finala: avand in vedere ca poluarea afecteaza sanatatea (A) si ca transportul electric reduce poluarea (B), orasele ar trebui sa investeasca masiv in transport in comun electric.\" Diagrama structurii: [Sub-arg A: poluare -> morbidititate] -> [C-A: poluarea afecteaza sanatatea] | [Sub-arg B: transport electric -> mai putine emisii] -> [C-B: transportul electric reduce poluarea] | C-A + C-B -> [C finala: investitii in transport electric]. Vulnerabilitati: sub-arg A are o presupunere de cauzalitate (asociere != cauzare); sub-arg B presupune ca 40% reducere e suficienta pentru a trece sub limitele OMS.",
      },
    ],
  },

  // 3. predict -- Identifica concluzia intermediara si finala
  {
    type: "predict",
    question: "Citeste argumentul si identifica INAINTE de reveal: care e concluzia intermediara si care e concluzia finala?\n\n\"Automatizarea elimina joburi repetitive. Joburile repetitive sunt ocupate in proportie de 70% de persoane fara studii superioare. Prin urmare, automatizarea va afecta disproportionat persoanele fara studii superioare. Persoanele fara studii superioare au acces limitat la programe de recalificare. Deci, fara interventie publica, automatizarea va adanci inegalitatile economice.\"",
    answer: "Concluzia INTERMEDIARA: \"Automatizarea va afecta disproportionat persoanele fara studii superioare.\" -- este sustinuta de primele doua premise (automatizarea elimina joburi repetitive + 70% din aceste joburi sunt ale persoanelor fara studii) si devine la randul ei premisa pentru urmatorul pas. Concluzia FINALA: \"Fara interventie publica, automatizarea va adanci inegalitatile economice.\" -- este sustinuta de concluzia intermediara + premisa suplimentara despre accesul limitat la recalificare. Structura: [P1 + P2 -> C-intermediara] + [P3] -> [C-finala].",
  },

  // 4. think -- Daca sub-argumentul e fals, concluzia finala mai tine?
  {
    type: "think",
    question: "Refera-te la Argumentul 2 din sectiunea anterioara (poluare + transport electric). Daca Sub-argumentul B ar fi fals -- adica transportul in comun electric NU reduce semnificativ emisiile in conditii reale de trafic urban -- concluzia finala mai tine? De ce da sau de ce nu? Ce ar trebui sa fie adevarat pentru ca concluzia finala sa ramana valida?",
  },

  // 5. recall -- 4 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Ce este o concluzie intermediara (sub-concluzie) intr-un argument multi-strat?",
        options: [
          "O premisa care vine dupa concluzia finala si o explica.",
          "O propozitie care e sustinuta de un set de premise si care, la randul ei, sustine concluzia finala.",
          "O concluzie alternativa pe care autorul o respinge.",
          "O dovada empirica introdusa in mijlocul argumentului.",
        ],
        correct: 1,
      },
      {
        question: "Intr-un lant de rationament P1 + P2 -> C1 -> C1 + P3 -> C2, ce se intampla daca legatura P1 + P2 -> C1 e invalida?",
        options: [
          "C2 ramane valida daca P3 e suficient de puternica.",
          "Doar C1 cade -- C2 poate fi sustinuta independent de P3.",
          "Intregul lant se rupe: C1 nefiind sustinuta, nu poate servi ca premisa pentru C2.",
          "Argumentul devine mai slab dar C2 ramane probabil adevarata.",
        ],
        correct: 2,
      },
      {
        question: "Cum identifici ca un argument contine sub-argumente convergente, nu un lant liniar?",
        options: [
          "Sunt mai mult de 3 premise.",
          "Doua sau mai multe grupuri independente de premise sustin fiecare o concluzie intermediara proprie, iar ambele concluzii intermediare sustin impreuna concluzia finala.",
          "Argumentul contine cuvinte ca \"deci\" si \"prin urmare\" de mai multe ori.",
          "Concluzia finala e mai lunga decat premisele.",
        ],
        correct: 1,
      },
      {
        question: "Argument: \"Angajatii satisfacuti sunt mai productivi (P1). Productivitatea mai mare reduce costurile operationale (P2). Deci, satisfactia angajatilor reduce costurile (C1). Costurile mai mici cresc profitul (P3). Prin urmare, investitia in satisfactia angajatilor creste profitul (C2).\" Care propozitie este concluzia intermediara?",
        options: [
          "Angajatii satisfacuti sunt mai productivi.",
          "Costurile mai mici cresc profitul.",
          "Satisfactia angajatilor reduce costurile operationale.",
          "Investitia in satisfactia angajatilor creste profitul.",
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
    `lessons?title=eq.${encodeURIComponent("Multi-Layer Arguments")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Multi-Layer Arguments\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L5_4_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L5_4_CONTENT.length} nodes: concept (structuri), concept (2 argumente disecate), predict, think, recall (4 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Multi-Layer Arguments
  Block:  ${result.data?.id}
  Nodes:  ${L5_4_CONTENT.length}

  View at: http://localhost:5173/lessons/multi-layer-arguments
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

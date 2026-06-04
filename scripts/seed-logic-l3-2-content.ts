/**
 * Seed: L3.2 — Assumption Questions (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l3-2-content.ts
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

const L3_2_CONTENT = [
  // 1. concept -- Ce este o presupunere
  {
    type: "concept",
    title: "Ce este o presupunere (assumption) in logica formala",
    sections: [
      {
        label: "Definitie",
        text: "O presupunere este o propozitie nespusa explicit in argument, dar pe care argumentul o necesita pentru ca concluzia sa urmeze din premise. Fara aceasta propozitie, exista un gap logic intre premise si concluzie -- un salt neexplicat. Presupunerea este puntea invizibila a argumentului.",
      },
      {
        label: "Diferenta fata de premisa explicita",
        text: "Premisa explicita: enuntata direct in text -- autorul o prezinta ca punct de plecare. Presupunere: nespusa, dar necesara -- autorul o ia de buna fara sa o justifice. Exemplu: \"Programul de nutritie a redus greutatea participantilor. Deci, programul este eficient.\" Premisa explicita: reducerea greutatii. Presupunere: reducerea greutatii = eficienta programului (adica nu exista alti factori).",
      },
      {
        label: "Cum o identifici",
        text: "Intreaba-te: de ce premisa sustine concluzia? Ce trebuie sa fie adevarat in plus pentru ca saltul logic sa fie valid? Gasesti gap-ul dintre ce se spune si ce se conchide. Acel gap este umplut de presupunere. In LSAT, presupunerea necesara este cea fara de care argumentul se prabuseste -- nu cea care il intareste sau il completeaza.",
      },
    ],
  },

  // 2. paragraph -- Testul negatiei
  {
    type: "paragraph",
    text: "Testul negatiei este metoda de verificare a presupunerilor necesare: negi varianta de raspuns si verifici daca argumentul se prabuseste. Daca negand o varianta, concluzia devine imposibila sau lipsita de suport -- aceea este presupunerea necesara. Daca negand o varianta argumentul ramane intact, acea varianta nu este presupunerea necesara. Metoda functioneaza deoarece o presupunere necesara, prin definitie, este indispensabila argumentului.",
  },

  // 3. concept -- 3 argumente LSAT cu assumption questions (inlocuieste example)
  {
    type: "concept",
    title: "3 argumente LSAT cu Assumption Questions -- analiza completa",
    sections: [
      {
        label: "Argumentul 1",
        text: "Pasaj: \"Compania X a investit masiv in training-ul angajatilor. Ca urmare, productivitatea a crescut cu 30%. Deci, investitia in training este cea mai eficienta metoda de crestere a productivitatii.\" Gap: de la \"training a crescut productivitatea\" la \"e CEA MAI EFICIENTA metoda\". Presupunere necesara: \"Nu exista alte metode care sunt la fel de eficiente sau mai eficiente.\" Test negatie: \"Exista metode la fel de eficiente.\" -> concluzia (\"cea mai eficienta\") se prabuseste. Confirmat.",
      },
      {
        label: "Argumentul 2",
        text: "Pasaj: \"Studiile arata ca copiii care citesc 30 de minute zilnic obtin rezultate mai bune la testele de vocabular. Politicile scolare care impun lectura zilnica vor imbunatati deci vocabularul elevilor.\" Gap: de la \"lectura voluntara imbunatateste vocabularul\" la \"politicile scolare vor produce acelasi efect\". Presupunere necesara: \"Elevii vor citi efectiv 30 de minute zilnic daca politicile scolare impun asta.\" Test negatie: \"Elevii nu vor citi efectiv.\" -> concluzia se prabuseste. Confirmat.",
      },
      {
        label: "Argumentul 3 + greseli frecvente",
        text: "Pasaj: \"Orasele cu mai multi kilometri de piste de bicicleta au rate mai mici ale obezitatii. Deci, construirea de piste va reduce obezitatea.\" Presupunere necesara: \"Relatia dintre piste si rata obezitatii este cauzala, nu doar de corelatie.\" Greseala frecventa: alegerea variantei \"Oamenii doresc sa fie sanatosi\" -- aceasta intareste argumentul dar nu umple gap-ul specific (corelatie vs cauzalitate). Presupunerea necesara ataca exact saltul logic, nu subiectul general.",
      },
    ],
  },

  // 4. predict -- Identifica presupunerea
  {
    type: "predict",
    question: "Argument: \"Medicamentul Z a redus simptomele la 85% din pacientii dintr-un studiu clinic de 500 de persoane. Prin urmare, medicamentul Z este eficient in tratarea acestei boli la nivelul intregii populatii.\" Care este presupunerea necesara? Gandeste-te inainte sa dai reveal.",
    answer: "Presupunerea necesara: \"Cei 500 de pacienti din studiu sunt reprezentativi pentru intreaga populatie de pacienti cu aceasta boala.\" Test negatie: \"Esantionul nu este reprezentativ.\" -> concluzia (eficienta la nivelul intregii populatii) nu mai urmeaza din date. Argumentul se prabuseste. Alte variante plauzibile dar gresite: \"Medicamentul nu are efecte secundare\" (ar intari argumentul, dar nu e necesara pentru concluzia specifica) sau \"85% e un prag acceptabil de eficienta\" (subiectiv, nu umple gap-ul esantion -> populatie).",
  },

  // 5. recall -- 3 MCQ LSAT-style assumption questions
  {
    type: "recall",
    questions: [
      {
        question: "\"Toate universitatile cu rata mare de angajare a absolventilor ofera programe de internship. Universitatea Alfa are o rata mare de angajare. Deci, Alfa ofera programe de internship.\" Care este presupunerea necesara?",
        options: [
          "Universitatea Alfa este o universitate de prestigiu.",
          "Rata mare de angajare este cauzata exclusiv de programele de internship.",
          "Nu exista alte cai prin care o universitate poate atinge o rata mare de angajare fara internship.",
          "Studentii de la Alfa sunt mai motivati decat media.",
        ],
        correct: 2,
      },
      {
        question: "\"Orasul a redus bugetul pentru publicitatea anti-fumat cu 40%. In acelasi an, rata fumatorilor a crescut cu 5%. Deci, reducerea bugetului a cauzat cresterea ratei fumatorilor.\" Ce presupunere face acest argument?",
        options: [
          "Fumatul este daunatoare sanatatii.",
          "Nu exista alti factori care ar fi putut cauza cresterea ratei fumatorilor in acel an.",
          "Bugetul ar trebui majorat inapoi la nivelul initial.",
          "Publicitatea anti-fumat este intotdeauna eficienta.",
        ],
        correct: 1,
      },
      {
        question: "Aplici testul negatiei la varianta: \"Angajatii companiei X erau deja productivi inainte de training.\" Argumentul original: training -> crestere 30% productivitate -> training e cea mai eficienta metoda. Negand aceasta varianta (\"angajatii nu erau productivi inainte\"), argumentul:",
        options: [
          "Se prabuseste -- aceasta este presupunerea necesara.",
          "Ramane intact -- aceasta varianta nu este presupunerea necesara.",
          "Devine mai puternic -- negarea o intareste.",
          "Devine ambiguu -- nu putem determina efectul.",
        ],
        correct: 1,
      },
    ],
  },

  // 6. think -- Presupunere necesara vs suficienta
  {
    type: "think",
    question: "Ce diferentiaza o presupunere necesara de una suficienta? De ce LSAT cere intotdeauna presupunerea NECESARA si nu pe cea suficienta?",
    reveal: "Presupunere necesara: trebuie sa fie adevarata pentru ca argumentul sa fie valid. Fara ea, concluzia nu urmeaza. Presupunere suficienta: daca ar fi adevarata, garanteaza concluzia -- dar nu e obligatorie, pot exista si alte cai. Exemplu: \"Toti pasagerii au bilet\" este suficienta pentru a concluziona ca Ion (pasager) are bilet. Dar presupunerea necesara este mai ingusta: \"Ion nu a calatorit fara bilet.\" LSAT cere necesara deoarece testeaza intelegerea gap-ului logic specific, nu capacitatea de a imagina scenarii care garanteaza concluzia. O presupunere suficienta poate fi prea puternica si depaseste ceea ce argumentul necesita.",
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
    `lessons?title=eq.${encodeURIComponent("Assumption Questions")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Assumption Questions\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L3_2_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L3_2_CONTENT.length} nodes: concept, paragraph (testul negatiei), concept (3 argumente), predict, recall (3 MCQ), think`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Assumption Questions
  Block:  ${result.data?.id}
  Nodes:  ${L3_2_CONTENT.length}

  View at: http://localhost:5173/lessons/assumption-questions
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

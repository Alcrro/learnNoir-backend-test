/**
 * Seed: L3.5 — Inference Questions (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l3-5-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; inference examples use concept block.
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

const L3_5_CONTENT = [
  // 1. concept -- Must be true vs most supported
  {
    type: "concept",
    title: "Inference questions: must be true vs most supported",
    sections: [
      {
        label: "Diferenta dintre inferenta si concluzie",
        text: "Concluzia unui argument este propozitia pe care autorul incearca sa o demonstreze prin premise. Inferenta este o propozitie care urmeaza logic din informatiile date, chiar daca autorul nu a intentionat-o explicit. La inference questions, pasajul nu are o concluzie clara -- prezinta informatii, iar tu trebuie sa identifici ce se poate deduce cu siguranta (must be true) sau cu cel mai mare suport (most supported) din acele informatii.",
      },
      {
        label: "Cat de conservatoare trebuie sa fie inferenta",
        text: "Must be true: inferenta trebuie sa fie adevarata in ORICE scenariu in care informatiile din pasaj sunt adevarate. Daca exista macar un caz in care informatiile sunt adevarate dar inferenta e falsa, aceea nu e o inferenta valida. Most supported: inferenta trebuie sa fie cea mai bine sustinuta de informatii, chiar daca nu e garantata cu certitudine absoluta. In ambele cazuri, regula de aur: inferentele conservative sunt aproape intotdeauna corecte; inferentele care merg dincolo de ce spun informatiile sunt aproape intotdeauna gresite.",
      },
      {
        label: "Cum eviti over-inference",
        text: "Over-inference: tragi concluzii care depasesc informatiile date. Semnale de avertizare: varianta introduce un concept nou nementionat in pasaj; varianta face o afirmatie despre \"toti\" cand pasajul spune \"majoritatea\"; varianta introduce o valoare morala sau o recomandare politica acolo unde pasajul prezinta doar fapte. Testul: poti demonstra aceasta propozitie EXCLUSIV din informatiile date, fara nicio presupunere suplimentara?",
      },
    ],
  },

  // 2. concept -- 3 inference questions cu analiza (inlocuieste example)
  {
    type: "concept",
    title: "3 inference questions -- de ce raspunsul corect e cel mai conservator",
    sections: [
      {
        label: "Exemplul 1 -- Must be true",
        text: "Pasaj: \"Toate companiile listate la bursa sunt obligate prin lege sa publice rapoarte financiare anuale. Compania X este listata la bursa.\" Intrebare: \"Ce trebuie sa fie adevarat pe baza informatiilor de mai sus?\" Corect: \"Compania X este obligata sa publice rapoarte financiare anuale.\" -- decurge cu necesitate (silogism categoric valid). Incorect: \"Compania X este profitabila\" -- nu e mentionat; \"Rapoartele companiei X sunt publice\" -- posibil, dar nu garantat de informatiile date (obligatia nu implica si actul efectiv).",
      },
      {
        label: "Exemplul 2 -- Most supported",
        text: "Pasaj: \"Majoritatea studentilor care au urmat cursul de programare intensiva au gasit un loc de munca in domeniu in 6 luni. Bianca a urmat cursul de programare intensiva.\" Intrebare: \"Ce este cel mai bine sustinut?\" Corect: \"Bianca are sanse mai mari decat media de a gasi un loc de munca in programare in 6 luni.\" -- conservator si sustinut. Incorect: \"Bianca va gasi un loc de munca in programare\" -- over-inference: \"majoritatea\" nu inseamna \"toti\"; Bianca poate fi in minoritatea care nu gaseste.",
      },
      {
        label: "Exemplul 3 -- Inferenta din propozitii multiple",
        text: "Pasaj: \"Niciun medicament aprobat de agentia nationala nu a depasit doza letala la testele preclinice. Medicamentul Y a depasit doza letala la testele preclinice.\" Intrebare: \"Ce trebuie sa fie adevarat?\" Corect: \"Medicamentul Y nu a fost aprobat de agentia nationala.\" -- modus tollens: daca aprobat -> nu depasit doza letala; a depasit doza letala -> nu aprobat. Incorect: \"Medicamentul Y este periculos\" -- depasirea dozei letale in teste preclinice nu implica neaparat pericol practic; over-inference.",
      },
    ],
  },

  // 3. predict -- Deducere cu certitudine din 3 propozitii
  {
    type: "predict",
    question: "Citeste cele 3 propozitii si decide ce poti deduce cu CERTITUDINE inainte sa dai reveal:\n(1) Niciun produs certificat organic nu contine pesticide sintetice.\n(2) Toate produsele vandute in magazinul Z sunt certificate organic.\n(3) Merele Ionescu sunt vandute in magazinul Z.",
    answer: "Inferenta valida (must be true): \"Merele Ionescu nu contin pesticide sintetice.\" Lantul logic: (3) Merele Ionescu sunt in magazinul Z -> (2) deci sunt certificate organic -> (1) deci nu contin pesticide sintetice. Fiecare pas este garantat de una din propozitii. Nu poti deduce: \"Merele Ionescu sunt sanatoase\" (over-inference -- organic nu inseamna automat sanatos), sau \"Toate merele certificate organic sunt bune\" (nu e in informatii).",
  },

  // 4. recall -- 4 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Pasaj: \"Toti membrii comitetului au votat pentru propunere. Directorul este membru al comitetului.\" Ce trebuie sa fie adevarat?",
        options: [
          "Propunerea va fi implementata.",
          "Directorul a votat pentru propunere.",
          "Comitetul aproba intotdeauna propunerile directorului.",
          "Propunerea este buna pentru organizatie.",
        ],
        correct: 1,
      },
      {
        question: "La o intrebare de tip \"most supported\", pasajul spune: \"In ultimii 5 ani, 70% din startup-urile care au participat la programul de accelerare au obtinut finantare externa.\" Care varianta este cel mai bine sustinuta?",
        options: [
          "Toate startup-urile care participa la program vor obtine finantare.",
          "Programul de accelerare garanteaza succesul startup-urilor.",
          "Un startup care participa la program are o probabilitate de 70% sa obtina finantare externa.",
          "Fara program de accelerare, startup-urile nu pot obtine finantare.",
        ],
        correct: 2,
      },
      {
        question: "Care dintre urmatoarele este un semnal de over-inference?",
        options: [
          "Varianta reformuleaza direct o propozitie din pasaj.",
          "Varianta combina doua propozitii din pasaj printr-un silogism valid.",
          "Varianta introduce un concept (\"periculos\", \"moral\", \"optim\") absent din pasaj.",
          "Varianta este mai scurta decat celelalte.",
        ],
        correct: 2,
      },
      {
        question: "Pasaj: \"Unii angajati cu experienta de peste 10 ani au ales sa treaca la roluri de management. Radu are 12 ani de experienta.\" Ce poate fi dedus?",
        options: [
          "Radu va trece la un rol de management.",
          "Radu a ales sa treaca la management.",
          "Este posibil ca Radu sa fie unul dintre angajatii cu experienta de peste 10 ani care au ales managementul.",
          "Angajatii cu experienta tind sa prefere managementul.",
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
    `lessons?title=eq.${encodeURIComponent("Inference Questions")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Inference Questions\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L3_5_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L3_5_CONTENT.length} nodes: concept, concept (3 inference examples), predict, recall (4 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Inference Questions
  Block:  ${result.data?.id}
  Nodes:  ${L3_5_CONTENT.length}

  View at: http://localhost:5173/lessons/inference-questions
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

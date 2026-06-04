/**
 * Seed: L5.3 — Building Counterarguments (content blocks)
 *
 * Run:  npx tsx scripts/seed-logic-l5-3-content.ts
 * Idempotent: skips if a content block already exists for the lesson.
 *
 * Note: ExampleBlock is algorithm-only; arguments use concept block.
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

const L5_3_CONTENT = [
  // 1. concept -- Ce este un contraargument solid
  {
    type: "concept",
    title: "Ce este un contraargument solid -- trei principii",
    sections: [
      {
        label: "Nu este negarea concluziei",
        text: "Greseala cea mai frecventa: tratarea negarii concluziei drept contraargument. \"Tu spui ca X este adevarat; eu spun ca X nu este adevarat\" nu este un contraargument -- este o simpla contradictie. Un contraargument solid ofera MOTIVE pentru care concluzia adversarului e gresita sau limitata. Diferenta practica: negarea concluziei e o pozitie; un contraargument e o constructie logica cu premise proprii care mineaza pozitia adversarului.",
      },
      {
        label: "Atacati premisele sau presupunerile, nu concluzia",
        text: "Un contraargument eficient vizeaza fie (1) o premisa falsa sau discutabila din argumentul original, fie (2) o presupunere ascunsa care nu tine. Daca demonstrezi ca o premisa e falsa, argumentul se prabuseste chiar daca concluzia ar putea fi adevarata din alte motive. Daca demonstrezi ca presupunerea centrala nu tine (prin testul negarii), elimini legatura logica dintre premise si concluzie. Atacul la premisa e mai puternic decat atacul la concluzie.",
      },
      {
        label: "Nu e suficient sa spui 'dar si...' -- trebuie sa arati de ce conteaza",
        text: "Un contraargument slab adauga informatii fara sa arate cum afecteaza ele concluzia: \"Da, dar exista si alte beneficii\" sau \"Da, dar sunt si dezavantaje\" nu e un contraargument -- e o completare. Un contraargument solid arata (1) ce anume din argumentul original e gresite sau incompleto, si (2) de ce acel element face concluzia nevalida sau mai slaba. Structura unui contraargument solid: [Ce e gresit in argument] + [De ce face concluzia nevalida] + [dovada sau rationament propriu].",
      },
    ],
  },

  // 2. concept -- 3 argumente + contraargumentele lor (inlocuieste example)
  {
    type: "concept",
    title: "3 argumente cu contraargumentele lor -- analiza eficientei",
    sections: [
      {
        label: "Argumentul 1 si contraargumentul",
        text: "Argument: \"Tari care au legalizat canabisul medical au inregistrat o scadere a consumului in randul adolescentilor. Prin urmare, legalizarea canabisului medical nu duce la cresterea consumului juvenil.\" Contraargument SLAB: \"Nu sunt de acord -- legalizarea normalizeaza consumul.\" (e o simpla pozitie opusa, fara sustinere). Contraargument SOLID: \"Premisa argumentului e empiric contestata: studii din Colorado si Washington arata ca rata consumului in randul adolescentilor a crescut sau a ramas stabila dupa legalizare, nu a scazut. Argumentul se bazeaza pe dovezi selective.\" Ce face contraargumentul solid eficient: ataca direct premisa empirica cu date contrare.",
      },
      {
        label: "Argumentul 2 si contraargumentul",
        text: "Argument: \"Studentii care folosesc laptopuri in sala de curs au note mai mici decat cei care iau notite de mana. Prin urmare, universitatile ar trebui sa interzica laptopurile in sala de curs.\" Contraargument SLAB: \"Dar laptopurile au si beneficii -- acces la resurse, note mai organizate.\" (adauga informatii fara sa mineeze concluzia). Contraargument SOLID: \"Presupunerea centrala a argumentului e ca diferenta de note e cauzata de laptop, nu de faptul ca studenti mai putin motivati sau mai putin organizati tind sa foloseasca laptop. Interdictia laptopurilor ar putea elimina un simptom (distragerea), nu cauza (motivatia scazuta), si ar priva studenti cu dizabilitati sau nevoi speciale de un instrument esential.\" Ce face contraargumentul solid eficient: demascheaza presupunerea de cauzalitate si arata consecinte nedorite.",
      },
      {
        label: "Argumentul 3 si contraargumentul",
        text: "Argument: \"Companiile cu diversitate de gen ridicata in management au profituri cu 21% mai mari. Prin urmare, companiile ar trebui sa adopte cote obligatorii de gen in pozitii de conducere.\" Contraargument SLAB: \"Nu sunt de acord cu cotele -- calitatea trebuie sa primeze.\" (pozitie fara sustinere logica). Contraargument SOLID: \"Argumentul confunda corelatie cu cauzalitate: companiile cu diversitate de gen in management pot performa mai bine nu din cauza diversitatii in sine, ci pentru ca sunt companii mai mari, mai mature sau mai deschise la practici moderne de management -- care includ si diversitatea. Cotele obligatorii nu garanteaza transferul cauzei reale si pot genera selectie bazata pe criterii formale in loc de competenta. O masura mai tintita ar fi eliminarea barierelor structurale in promovare.\" Ce face contraargumentul solid eficient: ataca presupunerea cauzala, propune o alternativa.",
      },
    ],
  },

  // 3. think -- Construieste un contraargument
  {
    type: "think",
    question: "Construieste un contraargument solid pentru urmatorul argument:\n\n\"Exercitiul fizic zilnic imbunatateste performanta academica, conform studiilor. Prin urmare, universitatile ar trebui sa faca exercitiul fizic obligatoriu pentru toti studentii.\"\n\nIdentifica: (1) ce premisa sau presupunere ataci, (2) de ce face concluzia mai slaba, (3) ce alternativa propui daca ai una.",
  },

  // 4. recall -- 3 MCQ
  {
    type: "recall",
    questions: [
      {
        question: "Argument: \"Companiile care ofera masa gratuita angajatilor au o rata de retentie mai mare. Deci, oferirea mesei gratuite creste retentia.\" Care varianta este CEL MAI PUTERNIC contraargument?",
        options: [
          "Nu sunt de acord -- masa gratuita nu e importanta pentru toti angajatii.",
          "Exista si alte beneficii care pot creste retentia, nu doar masa.",
          "Presupunerea de cauzalitate e nefundata: companiile cu masa gratuita pot retine angajatii mai bine pentru ca sunt companii mari cu culturi organizationale superioare -- masa e un simptom, nu cauza retentiei.",
          "Masa gratuita e costisitoare si nu toate companiile si-o pot permite.",
        ],
        correct: 2,
      },
      {
        question: "Care dintre urmatoarele NU este un contraargument solid?",
        options: [
          "Demonstrarea ca premisa empirica a argumentului original e bazata pe date selective.",
          "Dezvaluirea unei presupuneri ascunse care nu tine si care face concluzia invalida.",
          "Afirmarea ca concluzia e gresita fara a oferi motive sau dovezi.",
          "Prezentarea unei explicatii alternative pentru corelata observata in argument.",
        ],
        correct: 2,
      },
      {
        question: "Care este structura unui contraargument solid?",
        options: [
          "Negarea concluziei + exemple personale care contrazic argumentul.",
          "Identificarea a ce e gresit in argument + explicarea de ce face concluzia invalida + dovada sau rationament propriu.",
          "Enumerarea tuturor dezavantajelor pozitiei adversarului.",
          "Adaugarea de informatii complementare care nuanteaza subiectul.",
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
    `lessons?title=eq.${encodeURIComponent("Building Counterarguments")}&select=id,title`,
  );
  if (lessons.length === 0) {
    throw new Error("Lesson \"Building Counterarguments\" not found -- run seed-logic-subject.ts first");
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
      data: { content: L5_3_CONTENT },
    },
    cookieHeader,
  ) as { data?: { id?: string } };

  console.log(`  checkmark Content block created (${result.data?.id})`);
  console.log(`  checkmark ${L5_3_CONTENT.length} nodes: concept (3 principii), concept (3 argumente), think, recall (3 MCQ)`);

  console.log(`
-- Done -------------------------------------------------

  Lesson: Building Counterarguments
  Block:  ${result.data?.id}
  Nodes:  ${L5_3_CONTENT.length}

  View at: http://localhost:5173/lessons/building-counterarguments
`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});

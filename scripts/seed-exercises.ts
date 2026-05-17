/**
 * Seeds 10 bubble-sort exercises into the `exercises` table.
 * Run: npx tsx scripts/seed-exercises.ts
 * Idempotent: skips rows whose (lesson_id, position) already exist.
 */

const SUPABASE_URL = "https://ypdfaegmuxxxiamhswgk.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZGZhZWdtdXh4eGlhbWhzd2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQzMjYyMywiZXhwIjoyMDkwMDA4NjIzfQ.6v-24nO6Pi3NP39ZDPxY7p9BIcwlkC236zvGo2n8H7s";

const HEADERS = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function supabaseGet<T>(path: string): Promise<T[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T[]>;
}

async function supabaseInsert(table: string, rows: unknown[]): Promise<unknown[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(rows),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`INSERT ${table} → ${res.status}: ${JSON.stringify(body)}`);
  return body as unknown[];
}

// ── resolve lesson ID ─────────────────────────────────────────────────────────

type LessonRow = { id: string; slug: string };

const lessons = await supabaseGet<LessonRow>("lessons?slug=eq.bubble-sort-de-la-teorie-la-implementare-partea-2&select=id,slug");
if (!lessons.length) {
  console.error("Bubble sort lesson not found. Run the main seed script first.");
  process.exit(1);
}
const LESSON_ID = lessons[0]!.id;
const ALGORITHM_ID = "bubble-sort";

console.log(`Seeding exercises for lesson ${LESSON_ID}...`);

// ── check existing ────────────────────────────────────────────────────────────

type ExRow = { id: string; position: number };
const existing = await supabaseGet<ExRow>(`exercises?lesson_id=eq.${LESSON_ID}&select=id,position`);
const existingPositions = new Set(existing.map((r) => r.position));
console.log(`  Found ${existing.length} existing exercises.`);

// ── exercise definitions ──────────────────────────────────────────────────────

const exercises = [
  {
    position: 1,
    title: "Primul pas al Bubble Sort",
    difficulty: "easy",
    description:
      "Implementează o singură trecere completă prin array, mutând cel mai mare element la final.\n\nFuncția `solve(arr)` primește un array de numere și returnează array-ul după o singură trecere de bubble sort.",
    examples: [
      { input: "[5, 3, 8, 1]", output: "[3, 5, 1, 8]", explanation: "8 a ajuns pe ultima poziție după o trecere." },
      { input: "[1, 2, 3]", output: "[1, 2, 3]", explanation: "Array-ul era deja sortat." },
    ],
    constraints: ["1 ≤ arr.length ≤ 1000", "Elementele pot fi orice numere întregi"],
    hints: [
      "Iterează de la index 0 până la arr.length - 2.",
      "La fiecare pas compară arr[j] cu arr[j+1] și schimbă-le dacă sunt în ordine greșită.",
    ],
    starter_code: `function solve(arr) {
  const a = [...arr]; // nu modifica input-ul original
  // TODO: o singură trecere bubble sort
  return a;
}`,
    test_cases: [
      { input: [[5, 3, 8, 1]], expected: [3, 5, 1, 8], is_hidden: false },
      { input: [[1, 2, 3]], expected: [1, 2, 3], is_hidden: false },
      { input: [[9, 7, 5, 3, 1]], expected: [7, 5, 3, 1, 9], is_hidden: true },
      { input: [[2, 1]], expected: [1, 2], is_hidden: true },
    ],
    tags: ["bubble-sort", "arrays"],
  },
  {
    position: 2,
    title: "Bubble Sort Complet",
    difficulty: "easy",
    description:
      "Implementează algoritmul Bubble Sort complet care sortează un array în ordine crescătoare.\n\nFuncția `solve(arr)` returnează un nou array sortat.",
    examples: [
      { input: "[64, 34, 25, 12, 22, 11, 90]", output: "[11, 12, 22, 25, 34, 64, 90]" },
      { input: "[1]", output: "[1]", explanation: "Un singur element este deja sortat." },
    ],
    constraints: ["0 ≤ arr.length ≤ 1000", "Returnează un nou array (nu modifica originalul)"],
    hints: [
      "Ai nevoie de două bucle imbricate: una exterioară pentru treceri, una interioară pentru comparații.",
      "Numărul de comparații necesar în trecerea i este arr.length - i - 1.",
      "Poți opri mai devreme dacă nu s-a făcut nicio interschimbare într-o trecere completă.",
    ],
    starter_code: `function solve(arr) {
  const a = [...arr];
  // TODO: bubble sort complet
  return a;
}`,
    test_cases: [
      { input: [[64, 34, 25, 12, 22, 11, 90]], expected: [11, 12, 22, 25, 34, 64, 90], is_hidden: false },
      { input: [[1]], expected: [1], is_hidden: false },
      { input: [[3, 1, 2]], expected: [1, 2, 3], is_hidden: false },
      { input: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5], is_hidden: true },
      { input: [[]], expected: [], is_hidden: true },
    ],
    tags: ["bubble-sort", "sorting"],
  },
  {
    position: 3,
    title: "Bubble Sort Optimizat",
    difficulty: "easy",
    description:
      "Implementează Bubble Sort cu optimizarea flag-ului `swapped`. Algoritmul trebuie să se oprească devreme dacă array-ul este deja sortat.\n\nReturnează numărul de treceri efectuate (nu array-ul sortat).",
    examples: [
      { input: "[1, 2, 3, 4, 5]", output: "1", explanation: "Array-ul deja sortat — o singură trecere fără swap confirmă." },
      { input: "[2, 1]", output: "1", explanation: "O singură trecere pentru a schimba 2 și 1." },
      { input: "[3, 2, 1]", output: "2", explanation: "Necesită 2 treceri." },
    ],
    constraints: ["1 ≤ arr.length ≤ 1000"],
    hints: [
      "Folosește un flag `swapped = false` la începutul fiecărei treceri.",
      "Dacă după o trecere `swapped` rămâne `false`, array-ul este sortat — poți opri.",
    ],
    starter_code: `function solve(arr) {
  const a = [...arr];
  let passes = 0;
  // TODO: bubble sort cu flag swapped, returnează numărul de treceri
  return passes;
}`,
    test_cases: [
      { input: [[1, 2, 3, 4, 5]], expected: 1, is_hidden: false },
      { input: [[2, 1]], expected: 1, is_hidden: false },
      { input: [[3, 2, 1]], expected: 2, is_hidden: false },
      { input: [[5, 4, 3, 2, 1]], expected: 4, is_hidden: true },
      { input: [[1]], expected: 0, is_hidden: true },
    ],
    tags: ["bubble-sort", "optimization"],
  },
  {
    position: 4,
    title: "Numără Schimbările",
    difficulty: "easy",
    description:
      "Implementează Bubble Sort și returnează numărul total de interschimbări (swap-uri) efectuate pentru a sorta array-ul.\n\nAcesta măsoară cât de dezordonat era array-ul inițial.",
    examples: [
      { input: "[1, 2, 3]", output: "0", explanation: "Deja sortat, niciun swap." },
      { input: "[3, 2, 1]", output: "3", explanation: "3↔2, 3↔1, 2↔1." },
    ],
    constraints: ["1 ≤ arr.length ≤ 1000"],
    hints: [
      "Incrementează un contor de fiecare dată când faci o interschimbare.",
    ],
    starter_code: `function solve(arr) {
  const a = [...arr];
  let swaps = 0;
  // TODO: bubble sort, numără swap-urile
  return swaps;
}`,
    test_cases: [
      { input: [[1, 2, 3]], expected: 0, is_hidden: false },
      { input: [[3, 2, 1]], expected: 3, is_hidden: false },
      { input: [[2, 1]], expected: 1, is_hidden: false },
      { input: [[4, 3, 2, 1]], expected: 6, is_hidden: true },
      { input: [[1]], expected: 0, is_hidden: true },
    ],
    tags: ["bubble-sort", "counting"],
  },
  {
    position: 5,
    title: "Bubble Sort Descrescător",
    difficulty: "easy",
    description:
      "Implementează Bubble Sort care sortează un array în ordine descrescătoare (de la mare la mic).\n\nFuncția `solve(arr)` returnează un nou array sortat descrescător.",
    examples: [
      { input: "[3, 1, 4, 1, 5, 9]", output: "[9, 5, 4, 3, 1, 1]" },
    ],
    constraints: ["0 ≤ arr.length ≤ 1000"],
    hints: [
      "Modifică condiția de comparare: schimbă arr[j] < arr[j+1] în loc de arr[j] > arr[j+1].",
    ],
    starter_code: `function solve(arr) {
  const a = [...arr];
  // TODO: bubble sort descrescător
  return a;
}`,
    test_cases: [
      { input: [[3, 1, 4, 1, 5, 9]], expected: [9, 5, 4, 3, 1, 1], is_hidden: false },
      { input: [[1, 2, 3]], expected: [3, 2, 1], is_hidden: false },
      { input: [[5]], expected: [5], is_hidden: true },
      { input: [[]], expected: [], is_hidden: true },
    ],
    tags: ["bubble-sort", "sorting"],
  },
  {
    position: 6,
    title: "Sortează după Valoare Absolută",
    difficulty: "medium",
    description:
      "Sortează un array de numere întregi (inclusiv negative) folosind Bubble Sort, după valoarea absolută, în ordine crescătoare.\n\nDacă două elemente au aceeași valoare absolută, păstrează ordinea inițială (sortare stabilă).",
    examples: [
      { input: "[-3, 1, -2, 4]", output: "[1, -2, -3, 4]", explanation: "|1|=1, |-2|=2, |-3|=3, |4|=4." },
    ],
    constraints: ["1 ≤ arr.length ≤ 1000", "Elementele pot fi negative"],
    hints: [
      "Compară Math.abs(arr[j]) cu Math.abs(arr[j+1]).",
      "Bubble sort este stabil prin natură — nu face swap când sunt egale.",
    ],
    starter_code: `function solve(arr) {
  const a = [...arr];
  // TODO: bubble sort după valoare absolută
  return a;
}`,
    test_cases: [
      { input: [[-3, 1, -2, 4]], expected: [1, -2, -3, 4], is_hidden: false },
      { input: [[0, -1, 2, -3]], expected: [0, -1, 2, -3], is_hidden: false },
      { input: [[5, -5, 3]], expected: [3, 5, -5], is_hidden: true },
    ],
    tags: ["bubble-sort", "custom-comparator"],
  },
  {
    position: 7,
    title: "K Treceri de Bubble Sort",
    difficulty: "medium",
    description:
      "Efectuează exact K treceri de bubble sort și returnează array-ul rezultat. Nu sorta complet — oprește-te după exact K treceri.\n\nFuncția `solve(arr, k)` primește array-ul și numărul de treceri.",
    examples: [
      { input: "[5,3,8,1,2], k=2", output: "[3,1,2,5,8]", explanation: "Primele 2 treceri deplasează cele mai mari 2 elemente la final." },
    ],
    constraints: ["1 ≤ arr.length ≤ 1000", "0 ≤ k ≤ arr.length"],
    hints: [
      "Bucla exterioară rulează exact de k ori, nu arr.length ori.",
    ],
    starter_code: `function solve(arr, k) {
  const a = [...arr];
  // TODO: exact k treceri bubble sort
  return a;
}`,
    test_cases: [
      { input: [[5, 3, 8, 1, 2], 2], expected: [3, 1, 2, 5, 8], is_hidden: false },
      { input: [[3, 2, 1], 1], expected: [2, 1, 3], is_hidden: false },
      { input: [[1, 2, 3], 5], expected: [1, 2, 3], is_hidden: true },
      { input: [[4, 3, 2, 1], 0], expected: [4, 3, 2, 1], is_hidden: true },
    ],
    tags: ["bubble-sort", "partial-sort"],
  },
  {
    position: 8,
    title: "Verifică dacă Array-ul e Sortat cu Bubble Sort",
    difficulty: "medium",
    description:
      "Folosind logica Bubble Sort, verifică dacă un array este deja sortat în ordine crescătoare.\n\nReturnează `true` dacă este sortat, `false` altfel. Implementarea ta trebuie să se bazeze pe logica Bubble Sort (comparații pereche), nu pe `.every()` sau alte metode.",
    examples: [
      { input: "[1, 2, 3, 4]", output: "true" },
      { input: "[1, 3, 2, 4]", output: "false" },
    ],
    constraints: ["0 ≤ arr.length ≤ 10000"],
    hints: [
      "Dacă faci o trecere completă fără niciun swap, array-ul este sortat.",
    ],
    starter_code: `function solve(arr) {
  // TODO: verifică dacă arr e sortat folosind logica bubble sort
  // returnează true sau false
}`,
    test_cases: [
      { input: [[1, 2, 3, 4]], expected: true, is_hidden: false },
      { input: [[1, 3, 2, 4]], expected: false, is_hidden: false },
      { input: [[]], expected: true, is_hidden: false },
      { input: [[5]], expected: true, is_hidden: true },
      { input: [[2, 1]], expected: false, is_hidden: true },
    ],
    tags: ["bubble-sort", "validation"],
  },
  {
    position: 9,
    title: "Bubble Sort pe Obiecte",
    difficulty: "medium",
    description:
      "Sortează un array de obiecte `{name, score}` folosind Bubble Sort, în ordine descrescătoare după `score`.\n\nFuncția `solve(students)` returnează un nou array sortat.",
    examples: [
      {
        input: '[{name:"Ana",score:85},{name:"Bob",score:92},{name:"Cara",score:78}]',
        output: '[{name:"Bob",score:92},{name:"Ana",score:85},{name:"Cara",score:78}]',
      },
    ],
    constraints: ["1 ≤ students.length ≤ 1000"],
    hints: [
      "Compară students[j].score cu students[j+1].score.",
      "Swapul schimbă întregul obiect.",
    ],
    starter_code: `function solve(students) {
  const a = [...students];
  // TODO: bubble sort descrescător după score
  return a;
}`,
    test_cases: [
      {
        input: [[{ name: "Ana", score: 85 }, { name: "Bob", score: 92 }, { name: "Cara", score: 78 }]],
        expected: [{ name: "Bob", score: 92 }, { name: "Ana", score: 85 }, { name: "Cara", score: 78 }],
        is_hidden: false,
      },
      {
        input: [[{ name: "X", score: 50 }, { name: "Y", score: 50 }]],
        expected: [{ name: "X", score: 50 }, { name: "Y", score: 50 }],
        is_hidden: true,
      },
    ],
    tags: ["bubble-sort", "objects"],
  },
  {
    position: 10,
    title: "Cocktail Shaker Sort",
    difficulty: "hard",
    description:
      "Cocktail Shaker Sort este o variație bidirecțională a Bubble Sort. Alternează între treceri de la stânga la dreapta și de la dreapta la stânga.\n\nImplementează `solve(arr)` care returnează array-ul sortat folosind Cocktail Shaker Sort.",
    examples: [
      { input: "[5,1,4,2,8,0,2]", output: "[0,1,2,2,4,5,8]" },
    ],
    constraints: ["0 ≤ arr.length ≤ 1000"],
    hints: [
      "Menține doi pointeri: `left` (crește) și `right` (scade).",
      "Prima trecere merge stânga→dreapta și deplasează maximul la `right`; a doua merge dreapta→stânga și deplasează minimul la `left`.",
      "Oprește-te dacă nicio trecere nu a produs swap.",
    ],
    starter_code: `function solve(arr) {
  const a = [...arr];
  let left = 0;
  let right = a.length - 1;
  // TODO: cocktail shaker sort
  return a;
}`,
    test_cases: [
      { input: [[5, 1, 4, 2, 8, 0, 2]], expected: [0, 1, 2, 2, 4, 5, 8], is_hidden: false },
      { input: [[3, 2, 1]], expected: [1, 2, 3], is_hidden: false },
      { input: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 4, 5], is_hidden: true },
      { input: [[]], expected: [], is_hidden: true },
    ],
    tags: ["bubble-sort", "cocktail-sort", "bidirectional"],
  },
];

// ── seed ──────────────────────────────────────────────────────────────────────

let inserted = 0;
let skipped = 0;

const toInsert = exercises
  .filter((ex) => {
    if (existingPositions.has(ex.position)) {
      console.log(`  ~ Position ${ex.position} already exists — skipping.`);
      skipped++;
      return false;
    }
    return true;
  })
  .map((ex) => ({
    lesson_id: LESSON_ID,
    algorithm_id: ALGORITHM_ID,
    position: ex.position,
    title: ex.title,
    difficulty: ex.difficulty,
    description: ex.description,
    examples: ex.examples,
    constraints: ex.constraints,
    hints: ex.hints,
    starter_code: ex.starter_code,
    test_cases: ex.test_cases,
    tags: ex.tags,
  }));

if (toInsert.length > 0) {
  const rows = await supabaseInsert("exercises", toInsert);
  inserted = rows.length;
}

console.log(`\nDone: ${inserted} inserted, ${skipped} skipped.`);

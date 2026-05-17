/**
 * Seeds 10 quiz assessment blocks for the bubble-sort lesson.
 * Full quiz questions are stored in lesson_blocks.data JSONB — no frontend mocks needed.
 *
 * Run: npx tsx scripts/seed-quizzes.ts
 * Idempotent: PATCH existing blocks, INSERT missing ones.
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

async function supabasePatch(path: string, body: unknown): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} → ${res.status}: ${await res.text()}`);
}

async function supabaseDelete(path: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: "DELETE",
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  });
  if (!res.ok) throw new Error(`DELETE ${path} → ${res.status}: ${await res.text()}`);
}

async function supabaseInsert(table: string, rows: unknown[]): Promise<unknown[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`INSERT ${table} → ${res.status}: ${await res.text()}`);
  return res.json() as Promise<unknown[]>;
}

// ── Quiz data (stored in DB) ─────────────────────────────────────────────────

const QUIZZES = [
  {
    quizId: "bs-fundamentals",
    title: "Fundamente Bubble Sort",
    difficulty: "intermediate",
    position: 2,
    questions: [
      {
        id: "bs1-1", type: "mcq", difficulty: "beginner",
        question: "Ce face Bubble Sort cu elementele adiacente?",
        options: ["Le inserează în poziția sortată", "Le compară și le interschimbă dacă sunt în ordine greșită", "Le interclasează într-un subarray sortat", "Selectează minimul și îl pune primul"],
        correctIndex: 1,
        explanation: "Bubble Sort parcurge repetat array-ul, comparând perechile adiacente și interschimbându-le când sunt în ordinea greșită.",
      },
      {
        id: "bs1-2", type: "mcq", difficulty: "beginner",
        question: "După prima parcurgere completă a Bubble Sort, ce este garantat?",
        options: ["Array-ul este complet sortat", "Cel mai mic element este la indexul 0", "Cel mai mare element este pe poziția finală", "Jumătate din array este sortat"],
        correctIndex: 2,
        explanation: "Cel mai mare element 'burbuie' până la ultima poziție după o parcurgere completă.",
      },
      {
        id: "bs1-3", type: "mcq", difficulty: "intermediate",
        question: "Care este complexitatea timp în cel mai rău caz a Bubble Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctIndex: 2,
        explanation: "În cel mai rău caz (array sortat invers), fiecare pereche adiacentă trebuie interschimbată — n*(n-1)/2 comparații, deci O(n²).",
      },
      {
        id: "bs1-4", type: "mcq", difficulty: "intermediate",
        question: "Ce proprietate face Bubble Sort un algoritm de sortare stabil?",
        options: ["Rulează în O(n) pe input sortat", "Nu interschimbă niciodată elemente egale adiacente", "Nu folosește memorie suplimentară", "Face întotdeauna exact n parcurgeri"],
        correctIndex: 1,
        explanation: "Elementele egale nu sunt niciodată interschimbate, deci ordinea lor relativă originală este întotdeauna păstrată — definiția unui sort stabil.",
      },
      {
        id: "bs1-5", type: "input", difficulty: "intermediate",
        question: "Cu optimizarea early-exit, câte parcurgeri are nevoie Bubble Sort pe un array deja sortat? (introdu un număr)",
        correctAnswer: "1",
        placeholder: "Introdu un număr…",
        explanation: "O singură parcurgere cu zero swap-uri este suficientă pentru a confirma că array-ul este sortat — algoritmul iese imediat.",
      },
      {
        id: "bs1-6", type: "mcq", difficulty: "expert",
        question: "Cocktail Shaker Sort este o variantă bidirecțională a Bubble Sort. Ce problemă specifică rezolvă?",
        options: ["Reduce complexitatea spațiu la O(log n)", "Elimină problema 'broaștelor țestoase' — elemente mici care se mișcă stânga foarte lent", "Atinge complexitate O(n log n) în cel mai rău caz", "Elimină comparațiile duplicate în fiecare parcurgere"],
        correctIndex: 1,
        explanation: "În Bubble Sort standard, elementele mari burbuie rapid la dreapta, dar elementele mici ('broaște țestoase') de lângă capătul drept se mișcă stânga cu o singură poziție pe parcurgere. Alternarea direcției de scanare rezolvă asta.",
      },
      {
        id: "bs1-7", type: "mcq", difficulty: "expert",
        question: "Pentru un array de lungime n în cel mai rău caz, care este numărul exact de swap-uri pe care le face Bubble Sort?",
        options: ["n²", "n(n−1)/2", "n(n+1)/2", "2n−1"],
        correctIndex: 1,
        explanation: "Numărul de swap-uri este egal cu numărul de inversiuni. Pentru un array sortat invers, numărul de inversiuni este n*(n-1)/2.",
      },
    ],
  },
  {
    quizId: "bs-swaps",
    title: "Swap-uri și Inversiuni",
    difficulty: "intermediate",
    position: 10,
    questions: [
      {
        id: "bs2-1", type: "mcq", difficulty: "beginner",
        question: "Ce este o inversiune într-un array?",
        options: ["O pereche de indici (i, j) unde i < j dar arr[i] > arr[j]", "Un element care nu este pe poziția sa sortată", "Două elemente identice unul lângă altul", "Un element care a fost interschimbat de mai multe ori"],
        correctIndex: 0,
        explanation: "O inversiune este orice pereche unde un element mai mare apare înaintea unuia mai mic — exact perechile pe care Bubble Sort trebuie să le corecteze.",
      },
      {
        id: "bs2-2", type: "input", difficulty: "beginner",
        question: "Câte inversiuni are array-ul [3, 1, 2]? (introdu un număr)",
        correctAnswer: "2",
        placeholder: "Introdu un număr…",
        explanation: "Inversiunile sunt (3,1) și (3,2). Elementul 3 apare înaintea lui 1 și 2, care sunt mai mici.",
      },
      {
        id: "bs2-3", type: "mcq", difficulty: "intermediate",
        question: "Care este relația dintre numărul de swap-uri efectuate de Bubble Sort și inversiuni?",
        options: ["Swap-uri = inversiuni × 2", "Swap-uri = exact inversiuni", "Swap-uri ≤ inversiuni", "Nu există o relație directă"],
        correctIndex: 1,
        explanation: "Fiecare swap adiacent elimină exact o inversiune. Numărul total de swap-uri este egal cu numărul total de inversiuni din input.",
      },
      {
        id: "bs2-4", type: "input", difficulty: "intermediate",
        question: "Pentru array-ul [5, 4, 3, 2, 1] (n=5), câte swap-uri totale face Bubble Sort? (introdu un număr)",
        correctAnswer: "10",
        placeholder: "Introdu un număr…",
        explanation: "Array complet inversat are n*(n-1)/2 = 5*4/2 = 10 inversiuni, deci exact 10 swap-uri.",
      },
      {
        id: "bs2-5", type: "mcq", difficulty: "intermediate",
        question: "Care array are mai multe inversiuni?",
        options: ["[1, 2, 3, 4, 5]", "[2, 1, 3, 4, 5]", "[5, 4, 3, 2, 1]", "[1, 3, 2, 5, 4]"],
        correctIndex: 2,
        explanation: "[5,4,3,2,1] este complet inversat și are 10 inversiuni — maximul pentru n=5. Celelalte au 0, 1 și respectiv 2.",
      },
      {
        id: "bs2-6", type: "mcq", difficulty: "expert",
        question: "De ce interschimbarea numai a elementelor adiacente garantează că fiecare swap reduce numărul de inversiuni cu exact 1?",
        options: ["Pentru că elementele adiacente au cea mai mică diferență de valoare", "Interschimbarea elementelor non-adiacente ar putea introduce noi inversiuni cu elementele dintre ele", "Evită atingerea elementelor deja sortate", "Swap-urile adiacente mențin algoritmul stabil"],
        correctIndex: 1,
        explanation: "Când interschimbi arr[i] și arr[i+1] (în ordine greșită), corectezi exact inversiunea lor. Ordinea niciunei alte perechi nu se schimbă, deci numărul de inversiuni scade cu exact 1.",
      },
    ],
  },
  {
    quizId: "bs-early-exit",
    title: "Optimizare Early Exit",
    difficulty: "beginner",
    position: 11,
    questions: [
      {
        id: "bs3-1", type: "mcq", difficulty: "beginner",
        question: "Ce variabilă booleană este folosită în Bubble Sort optimizat?",
        options: ["sorted", "done", "swapped", "finished"],
        correctIndex: 2,
        explanation: "`swapped` este setat pe true ori de câte ori apare un swap într-o parcurgere. Dacă o parcurgere se termină cu swapped=false, array-ul este sortat.",
      },
      {
        id: "bs3-2", type: "mcq", difficulty: "beginner",
        question: "Care este complexitatea timp în cel mai bun caz a Bubble Sort cu optimizarea early-exit?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
        correctIndex: 2,
        explanation: "Pe un array sortat, o parcurgere nu găsește niciun swap și iese — se fac doar n-1 comparații, dând O(n) în cel mai bun caz.",
      },
      {
        id: "bs3-3", type: "mcq", difficulty: "intermediate",
        question: "Fără flag-ul early-exit, care este complexitatea în cel mai bun caz a Bubble Sort de bază?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(n√n)"],
        correctIndex: 2,
        explanation: "Fără flag, bucla externă rulează întotdeauna n-1 ori indiferent de ordinea inputului, dând O(n²) chiar și pe date sortate.",
      },
      {
        id: "bs3-4", type: "input", difficulty: "intermediate",
        question: "Bubble Sort optimizat pe un array sortat de 100 elemente: câte comparații se fac? (introdu un număr)",
        correctAnswer: "99",
        placeholder: "Introdu un număr…",
        explanation: "O singură parcurgere compară n-1 = 99 perechi adiacente, nu găsește niciun swap, setează swapped=false și iese.",
      },
      {
        id: "bs3-5", type: "mcq", difficulty: "expert",
        question: "Aplici early-exit și reduci și limita buclei interne după fiecare parcurgere. Cum se numește această optimizare combinată?",
        options: ["Comb Sort", "Shell Sort", "Bubble Sort standard cu două optimizări", "Gnome Sort"],
        correctIndex: 2,
        explanation: "Urmărirea poziției ultimului swap pentru a reduce intervalul activ este o a doua optimizare adăugată peste early-exit — este tot Bubble Sort standard, doar mai bine reglat.",
      },
    ],
  },
  {
    quizId: "bs-variants",
    title: "Variante Bubble Sort",
    difficulty: "intermediate",
    position: 12,
    questions: [
      {
        id: "bs4-1", type: "mcq", difficulty: "beginner",
        question: "Cocktail Shaker Sort diferă de Bubble Sort prin faptul că scanează…",
        options: ["Doar de la stânga la dreapta", "Doar de la dreapta la stânga", "Alternând stânga-dreapta și dreapta-stânga", "În direcție aleatorie la fiecare parcurgere"],
        correctIndex: 2,
        explanation: "Fiecare parcurgere completă a Cocktail Shaker Sort constă dintr-o scanare stânga-dreapta urmată de una dreapta-stânga.",
      },
      {
        id: "bs4-2", type: "mcq", difficulty: "intermediate",
        question: "Ce sunt 'broaștele țestoase' în contextul Bubble Sort?",
        options: ["Elemente mari lângă început care se mișcă rapid la dreapta", "Elemente mici lângă sfârșit care se mișcă stânga foarte lent", "Elemente deja pe poziția lor sortată", "Elemente care cauzează cele mai multe comparații"],
        correctIndex: 1,
        explanation: "'Broaștele țestoase' sunt elemente mici lângă capătul drept. Se mișcă stânga cu o singură poziție pe parcurgere, făcând Bubble Sort standard lent pe astfel de inputuri.",
      },
      {
        id: "bs4-3", type: "mcq", difficulty: "intermediate",
        question: "Comb Sort îmbunătățește Bubble Sort prin…",
        options: ["Scanare în ambele direcții", "Începe cu un gap mare între elementele comparate și îl reduce", "Selectează minimul la fiecare parcurgere", "Folosește un min-heap pentru comparații"],
        correctIndex: 1,
        explanation: "Comb Sort folosește inițial un gap > 1 (similar cu ideea Shell Sort) pentru a muta elementele pe distanțe mari rapid, eliminând eficient broaștele țestoase.",
      },
      {
        id: "bs4-4", type: "mcq", difficulty: "intermediate",
        question: "Odd-Even Sort (Brick Sort) este notabil deoarece poate…",
        options: ["Sorta în O(n log n) timp", "Fi paralelizat eficient pe sisteme multi-procesor", "Sorta fără nicio comparație", "Garanta O(n) timp pe input aproape sortat"],
        correctIndex: 1,
        explanation: "Odd-Even Sort alternează între compararea perechilor cu indici impari și pari — comparațiile independente din fiecare fază pot rula în paralel.",
      },
      {
        id: "bs4-5", type: "mcq", difficulty: "expert",
        question: "Care este factorul de reducere aproximativ folosit de Comb Sort pentru a micșora gap-ul la fiecare rundă?",
        options: ["1.3", "2.0", "1.5", "φ (raportul de aur ≈ 1.618)"],
        correctIndex: 0,
        explanation: "Un factor de reducere de 1.3 a fost găsit empiric ca oferind cele mai bune rezultate. Împărțind gap-ul curent la 1.3 (rotunjit în jos) la fiecare iterație funcționează bine în practică.",
      },
      {
        id: "bs4-6", type: "mcq", difficulty: "expert",
        question: "Cocktail Shaker Sort are aceeași complexitate în cel mai rău caz ca Bubble Sort. Ce îmbunătățește în practică?",
        options: ["Cel mai rău caz la O(n log n)", "Reduce numărul de parcurgeri necesare pentru inputuri cu broaște țestoase", "Complexitatea spațiu de la O(n) la O(1)", "Elimină comparațiile între elementele sortate"],
        correctIndex: 1,
        explanation: "Mișcând elementele în ambele direcții la fiecare rundă, elementele mici de lângă capăt ('broaște țestoase') pot avansa mai multe poziții pe parcurgere completă, reducând numărul total de parcurgeri.",
      },
    ],
  },
  {
    quizId: "bs-complexity",
    title: "Analiză Complexitate",
    difficulty: "intermediate",
    position: 13,
    questions: [
      {
        id: "bs5-1", type: "mcq", difficulty: "beginner",
        question: "Care este complexitatea spațiu a Bubble Sort?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctIndex: 3,
        explanation: "Bubble Sort sortează in-place, folosind doar un număr constant de variabile suplimentare (indici de buclă, variabilă temporară pentru swap). Spațiul este O(1).",
      },
      {
        id: "bs5-2", type: "mcq", difficulty: "beginner",
        question: "Care este complexitatea timp în cazul mediu a Bubble Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(n√n)"],
        correctIndex: 2,
        explanation: "Pe un input aleatoriu, aproximativ jumătate din perechi sunt inversiuni. Numărul așteptat de swap-uri este tot Θ(n²), dând O(n²) în medie.",
      },
      {
        id: "bs5-3", type: "input", difficulty: "intermediate",
        question: "Pentru n = 4 elemente în cel mai rău caz, câte comparații face Bubble Sort? (introdu un număr)",
        correctAnswer: "6",
        placeholder: "Introdu un număr…",
        explanation: "Comparații în cel mai rău caz = n*(n-1)/2 = 4*3/2 = 6.",
      },
      {
        id: "bs5-4", type: "mcq", difficulty: "intermediate",
        question: "Limita buclei interne scade cu 1 după fiecare parcurgere externă deoarece…",
        options: ["Primul element este întotdeauna sortat după fiecare parcurgere", "Ultimele i elemente sunt deja pe pozițiile lor finale", "Algoritmul are nevoie doar de jumătate din iterații", "Previne resetarea flag-ului swapped"],
        correctIndex: 1,
        explanation: "După parcurgerea i, cele i elemente mai mari au burbuiat la sfârșit și sunt pe pozițiile lor finale sortate. Nu mai este necesar să le comparăm.",
      },
      {
        id: "bs5-5", type: "mcq", difficulty: "expert",
        question: "Care afirmație este ADEVĂRATĂ despre numărul exact de comparații pentru Bubble Sort (fără early exit)?",
        options: ["Este întotdeauna n² comparații", "Este întotdeauna n*(n-1)/2 comparații indiferent de input", "Depinde de numărul de inversiuni din input", "Variază între n-1 și n*(n-1)/2 în funcție de input"],
        correctIndex: 1,
        explanation: "Fără early exit, bucla externă rulează întotdeauna n-1 ori, iar bucla internă rulează întotdeauna n-1-i ori. Numărul de comparații este întotdeauna n*(n-1)/2, independent de ordinea inputului.",
      },
    ],
  },
  {
    quizId: "bs-stability",
    title: "Stabilitate și Proprietăți",
    difficulty: "beginner",
    position: 14,
    questions: [
      {
        id: "bs6-1", type: "mcq", difficulty: "beginner",
        question: "Un algoritm de sortare se numește 'stabil' dacă…",
        options: ["Rulează întotdeauna în același timp", "Nu folosește memorie suplimentară", "Elementele egale își păstrează ordinea relativă originală", "Produce același rezultat la fiecare rulare"],
        correctIndex: 2,
        explanation: "Stabilitatea înseamnă: dacă două elemente au chei egale, cel care a apărut primul în input apare primul și în output.",
      },
      {
        id: "bs6-2", type: "mcq", difficulty: "beginner",
        question: "Este Bubble Sort un algoritm in-place?",
        options: ["Nu, necesită O(n) memorie suplimentară pentru o copie temporară", "Da, sortează folosind doar o cantitate constantă de spațiu suplimentar", "Doar în versiunea optimizată", "Nu, folosește un stack de dimensiune O(log n)"],
        correctIndex: 1,
        explanation: "Bubble Sort folosește doar câteva variabile (contoare de buclă, variabilă temporară pentru swap). Nu este necesar niciun array sau structură de date suplimentară.",
      },
      {
        id: "bs6-3", type: "mcq", difficulty: "intermediate",
        question: "Bubble Sort este descris ca 'adaptiv'. Ce înseamnă asta?",
        options: ["Poate sorta orice tip de date", "Performanța sa se îmbunătățește pe input aproape sortat", "Adaptează direcția de comparare în funcție de input", "Redimensionează dinamic structura de date auxiliară"],
        correctIndex: 1,
        explanation: "Cu flag-ul early-exit, Bubble Sort iese devreme când nu apar swap-uri. Pe input aproape sortat cu puține inversiuni, asta îl face semnificativ mai rapid decât O(n²).",
      },
      {
        id: "bs6-4", type: "mcq", difficulty: "intermediate",
        question: "Sortezi înregistrări după prenume cu Bubble Sort. Două înregistrări au același prenume. Ce este garantat?",
        options: ["Înregistrarea care a apărut prima în input va apărea prima în output", "Înregistrările vor fi pe aceeași poziție ca în input", "Nu este garantat nimic despre ordinea lor relativă", "Înregistrarea cu numele de familie mai scurt va apărea prima"],
        correctIndex: 0,
        explanation: "Deoarece Bubble Sort este stabil, elementele cu chei egale rețin ordinea din input. Prima înregistrare originală rămâne înaintea celei de-a doua.",
      },
      {
        id: "bs6-5", type: "mcq", difficulty: "expert",
        question: "Care dintre următorii algoritmi O(n²) NU este stabil?",
        options: ["Bubble Sort", "Insertion Sort", "Selection Sort", "Cocktail Shaker Sort"],
        correctIndex: 2,
        explanation: "Selection Sort nu este stabil — interschimbă elementul minim pe poziție, ceea ce poate schimba ordinea relativă a elementelor egale. Bubble Sort, Insertion Sort și Cocktail Shaker Sort sunt toți stabili.",
      },
    ],
  },
  {
    quizId: "bs-comparison",
    title: "Comparare cu Alți Algoritmi",
    difficulty: "intermediate",
    position: 15,
    questions: [
      {
        id: "bs7-1", type: "mcq", difficulty: "beginner",
        question: "Care algoritm de sortare face întotdeauna exact n*(n-1)/2 comparații, indiferent de input?",
        options: ["Bubble Sort (fără early exit)", "Insertion Sort", "Merge Sort", "Quick Sort"],
        correctIndex: 0,
        explanation: "Fără early exit, Bubble Sort rulează mereu toate n*(n-1)/2 comparații. Ceilalți variază în funcție de ordinea inputului.",
      },
      {
        id: "bs7-2", type: "mcq", difficulty: "intermediate",
        question: "Insertion Sort și Bubble Sort au ambii complexitate medie O(n²). Care este în general mai rapid în practică?",
        options: ["Bubble Sort, deoarece folosește swap-uri adiacente", "Insertion Sort, deoarece face în medie mai puține scrieri", "Sunt identici în practică", "Bubble Sort, deoarece are performanță cache mai bună"],
        correctIndex: 1,
        explanation: "Insertion Sort face cel mult o scriere per comparație în cel mai bun caz și în general mai puține mișcări de date, dând un factor constant mai mic.",
      },
      {
        id: "bs7-3", type: "mcq", difficulty: "intermediate",
        question: "Merge Sort are complexitate O(n log n) dar Bubble Sort este uneori preferat pentru array-uri foarte mici. De ce?",
        options: ["Bubble Sort este mai rapid pe array-uri sortate invers", "Merge Sort necesită O(n) memorie suplimentară; pentru n mic overhead-ul contează", "Bubble Sort are complexitate în cel mai rău caz mai bună pentru n < 10", "Merge Sort este instabil pentru array-uri mici"],
        correctIndex: 1,
        explanation: "Merge Sort alocă memorie auxiliară și are overhead de apeluri recursive. Pentru n < ~10 elemente, aceste constante domină și sortările simple O(n²) câștigă.",
      },
      {
        id: "bs7-4", type: "mcq", difficulty: "intermediate",
        question: "Ce avantaj are Selection Sort față de Bubble Sort?",
        options: ["Complexitate timp mai bună", "Este stabil", "Mai puține scrieri/swap-uri totale (cel mult n-1 swap-uri)", "Performanță mai bună pe input aproape sortat"],
        correctIndex: 2,
        explanation: "Selection Sort face exact n-1 swap-uri indiferent de input — util când scrierile sunt costisitoare. Bubble Sort poate face până la n*(n-1)/2 swap-uri.",
      },
      {
        id: "bs7-5", type: "mcq", difficulty: "expert",
        question: "Quicksort are O(n²) în cel mai rău caz dar depășește Bubble Sort în practică. Motivul principal este…",
        options: ["Quicksort folosește mai puține comparații în cel mai rău caz", "Quicksort are comportament cache mult mai bun și o constantă medie mai mică", "Quicksort este stabil, Bubble Sort nu", "Quicksort folosește sortare in-place, Bubble Sort nu"],
        correctIndex: 1,
        explanation: "Media O(n log n) a Quicksort cu constante mici și pattern-uri de acces secvențial la memorie îi dau performanță practică mult mai bună în ciuda aceluiași asimptot în cel mai rău caz.",
      },
    ],
  },
  {
    quizId: "bs-invariants",
    title: "Invarianți de Buclă și Corectitudine",
    difficulty: "expert",
    position: 16,
    questions: [
      {
        id: "bs8-1", type: "mcq", difficulty: "beginner",
        question: "După k parcurgeri externe complete ale Bubble Sort, ce este garantat despre array?",
        options: ["Primele k elemente sunt în ordine sortată", "Ultimele k elemente sunt pe pozițiile lor finale sortate", "Exact k elemente au fost interschimbate", "Array-ul este sortat până la mijloc"],
        correctIndex: 1,
        explanation: "Fiecare parcurgere burbuie maximul curent pe poziția sa finală corectă la sfârșit. După k parcurgeri, cele k elemente mai mari sunt la locul lor.",
      },
      {
        id: "bs8-2", type: "mcq", difficulty: "intermediate",
        question: "Invariantul de buclă pentru bucla externă a Bubble Sort afirmă că după i parcurgeri…",
        options: ["arr[0..i-1] este sortat", "arr[n-i..n-1] conține cele i elemente mai mari în ordine sortată", "Numărul de inversiuni a fost redus cu i", "Toate elementele la indici pari sunt în ordine sortată"],
        correctIndex: 1,
        explanation: "Invariantul formal: după a i-a parcurgere, arr[n-i..n-1] conține cele i elemente global mai mari pe pozițiile lor finale corecte.",
      },
      {
        id: "bs8-3", type: "mcq", difficulty: "intermediate",
        question: "De ce este suficientă limita superioară a buclei externe (n-1) — de ce nu n parcurgeri?",
        options: ["Ultimul element nu trebuie comparat", "După n-1 parcurgeri, toate elementele sunt pe pozițiile finale — elementul rămas trebuie să fie deja corect", "Bucla internă gestionează automat ultima parcurgere", "n parcurgeri ar cauza o eroare de index"],
        correctIndex: 1,
        explanation: "După ce n-1 elemente sunt plasate corect, rămâne un singur element și trebuie să fie cel mai mic — deja pe poziția corectă.",
      },
      {
        id: "bs8-4", type: "mcq", difficulty: "expert",
        question: "Ai un array de n elemente și știi că are cel mult k inversiuni (k << n²). Care algoritm profită de asta?",
        options: ["Merge Sort", "Selection Sort", "Bubble Sort optimizat (early exit + urmărire ultima poziție swap)", "Heap Sort"],
        correctIndex: 2,
        explanation: "Cu k inversiuni, Bubble Sort optimizat face exact k swap-uri și cel mult k+n-1 comparații — timp O(k+n). Pentru input aproape sortat, asta este mult mai bun decât O(n²).",
      },
      {
        id: "bs8-5", type: "mcq", difficulty: "expert",
        question: "Demonstrând prin invariant că array-ul este sortat la final: care argument de terminare este corect?",
        options: ["Bucla rulează la infinit dar array-ul este sortat când o parcurgere nu găsește swap-uri", "Fiecare parcurgere reduce numărul de inversiuni cu cel puțin 1; deoarece inversiunile ≥ 0, bucla se termină, iar 0 inversiuni înseamnă sortat", "Array-ul este sortat după exact n iterații, demonstrat prin inducție", "Flag-ul swapped asigură terminarea după cel mult 2 parcurgeri"],
        correctIndex: 1,
        explanation: "Fiecare parcurgere reduce inversiunile cu cel puțin 1 (corectează cel puțin inversiunea cea mai din dreapta). Numărul este mărginit inferior de 0, deci bucla se termină. Zero inversiuni ↔ array sortat.",
      },
    ],
  },
  {
    quizId: "bs-edge-cases",
    title: "Cazuri Speciale",
    difficulty: "intermediate",
    position: 17,
    questions: [
      {
        id: "bs9-1", type: "mcq", difficulty: "beginner",
        question: "Ce returnează Bubble Sort pe un array gol?",
        options: ["Aruncă o eroare", "Un array gol — nu se efectuează nicio iterație", "Un array cu un element null", "Intră într-o buclă infinită"],
        correctIndex: 1,
        explanation: "Cu n=0, condiția buclei externe (i < n-1 = -1) este falsă imediat, deci algoritmul returnează array-ul gol nemodificat.",
      },
      {
        id: "bs9-2", type: "mcq", difficulty: "beginner",
        question: "Bubble Sort rulează pe [42] (un singur element). Ce se întâmplă?",
        options: ["Aruncă o eroare de index", "Efectuează un swap", "Returnează [42] imediat fără comparații", "Are nevoie de o parcurgere completă"],
        correctIndex: 2,
        explanation: "Cu n=1, bucla externă rulează de 0 ori (n-1 = 0 iterații). Nu se efectuează nicio comparație sau swap.",
      },
      {
        id: "bs9-3", type: "mcq", difficulty: "intermediate",
        question: "Bubble Sort (optimizat) rulează pe [5, 5, 5, 5]. Câte swap-uri se efectuează?",
        options: ["0", "4", "6", "1"],
        correctIndex: 0,
        explanation: "Toate elementele sunt egale, deci nicio pereche adiacentă nu este în ordine greșită. Zero swap-uri. Prima parcurgere se termină cu swapped=false și algoritmul iese.",
      },
      {
        id: "bs9-4", type: "mcq", difficulty: "intermediate",
        question: "Pe inputul [1, 2, 3, 4, 5] (deja sortat, cu early exit), câte parcurgeri externe rulează?",
        options: ["0", "1", "4", "5"],
        correctIndex: 1,
        explanation: "O singură parcurgere este necesară pentru a verifica că array-ul este sortat (swapped rămâne false). Bucla externă iese apoi — exact 1 parcurgere, n-1 comparații.",
      },
      {
        id: "bs9-5", type: "mcq", difficulty: "expert",
        question: "Pe un array sortat invers de n elemente, pe ce poziție se află cel mai mic element după exact 1 parcurgere?",
        options: ["Indexul 0 — a ajuns în față", "Indexul n-2 — s-a mutat un pas la stânga", "Indexul n-1 — neschimbat", "Indexul n/2 — ajunge la mijloc"],
        correctIndex: 1,
        explanation: "Într-o parcurgere stânga-dreapta, minimul se mișcă stânga o singură dată — past elementul imediat la dreapta sa. După o parcurgere pe un array inversat, se află pe poziția n-2.",
      },
    ],
  },
  {
    quizId: "bs-code-tracing",
    title: "Trasare Cod",
    difficulty: "intermediate",
    position: 18,
    questions: [
      {
        id: "bs10-1", type: "mcq", difficulty: "beginner",
        question: "După o parcurgere stânga-dreapta pe [4, 2, 7, 1, 3], cum arată array-ul?",
        options: ["[2, 4, 1, 3, 7]", "[1, 2, 3, 4, 7]", "[4, 2, 1, 3, 7]", "[2, 4, 7, 1, 3]"],
        correctIndex: 0,
        explanation: "Parcurgere: (4,2)→swap→[2,4,7,1,3]; (4,7)→ok; (7,1)→swap→[2,4,1,7,3]; (7,3)→swap→[2,4,1,3,7]. Rezultat: [2,4,1,3,7].",
      },
      {
        id: "bs10-2", type: "input", difficulty: "beginner",
        question: "După două parcurgeri complete pe [5, 3, 1, 4, 2], ce valoare este la indexul 4 (ultima poziție)? (introdu un număr)",
        correctAnswer: "5",
        placeholder: "Introdu un număr…",
        explanation: "Parcurgere 1: 5 burbuie la sfârșit → [..., 5]. Parcurgere 2: 4 burbuie pe poziția dinaintea lui 5 → [..., 4, 5]. Indexul 4 = 5.",
      },
      {
        id: "bs10-3", type: "mcq", difficulty: "intermediate",
        question: "Ce bug există în acest cod?\n\nfor i in range(n):\n  for j in range(n - 1):\n    if arr[j] > arr[j+1]:\n      arr[j], arr[j+1] = arr[j+1], arr[j]",
        options: ["Bucla externă ar trebui să înceapă de la 1", "Bucla internă ar trebui să fie range(n - 1 - i) pentru a sări elementele deja sortate", "Comparația ar trebui să fie arr[j] >= arr[j+1]", "arr[j] și arr[j+1] sunt interschimbate în ordine greșită"],
        correctIndex: 1,
        explanation: "Fără `n - 1 - i`, bucla internă rulează întotdeauna n-1 ori, comparând elemente deja pe poziția finală. Este corect dar risipește O(n) comparații per parcurgere.",
      },
      {
        id: "bs10-4", type: "mcq", difficulty: "intermediate",
        question: "Bubble Sort optimizat rulează pe [3, 2, 1]. După care parcurgere rămâne `swapped` False?",
        options: ["Parcurgerea 1", "Parcurgerea 2", "Parcurgerea 3", "Parcurgerea 4"],
        correctIndex: 2,
        explanation: "Parcurg. 1: swap(3,2) și swap(3,1)→[2,1,3] swapped=True. Parcurg. 2: swap(2,1)→[1,2,3] swapped=True. Parcurg. 3: niciun swap→swapped=False→ieșire. Deci swapped rămâne False la parcurgerea 3.",
      },
      {
        id: "bs10-5", type: "mcq", difficulty: "expert",
        question: "Un dezvoltator schimbă `arr[j] > arr[j+1]` în `arr[j] >= arr[j+1]`. Ce proprietate a sortării se schimbă?",
        options: ["Algoritmul devine mai rapid", "Sortarea devine instabilă — elementele egale pot fi interschimbate", "Sortarea nu se mai termină", "Complexitatea în cel mai rău caz se îmbunătățește"],
        correctIndex: 1,
        explanation: "Folosind `>=` cauzează interschimbarea inutilă a elementelor egale adiacente, rupând garanția de stabilitate. Cu `>`, elementele egale nu sunt niciodată interschimbate și ordinea relativă este păstrată.",
      },
    ],
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const lessons = await supabaseGet<{ id: string }>(
    `lessons?slug=eq.bubble-sort-de-la-teorie-la-implementare-partea-2&select=id`,
  );
  if (lessons.length === 0) {
    console.error("Lesson not found.");
    process.exit(1);
  }
  const lessonId = lessons[0]!.id;
  console.log(`Lesson: ${lessonId}\n`);

  // Get existing assessment blocks
  const blocks = await supabaseGet<{ id: string; engine: string; data: Record<string, unknown>; position: number }>(
    `lesson_blocks?lesson_id=eq.${lessonId}&type=eq.assessment&select=id,engine,data,position&order=position`,
  );

  // Remove duplicate quiz:input block if still present
  const inputBlock = blocks.find((b) => b.engine === "quiz:input");
  if (inputBlock) {
    await supabaseDelete(`lesson_activities?lesson_block_id=eq.${inputBlock.id}`);
    await supabaseDelete(`lesson_blocks?id=eq.${inputBlock.id}`);
    console.log(`Deleted quiz:input block (${inputBlock.id})`);
  }

  const existingByQuizId = new Map(
    blocks
      .filter((b) => b.data.quizId)
      .map((b) => [b.data.quizId as string, b]),
  );

  for (const quiz of QUIZZES) {
    const existing = existingByQuizId.get(quiz.quizId);
    const { quizId, title, difficulty, position, questions } = quiz;

    if (existing) {
      await supabasePatch(`lesson_blocks?id=eq.${existing.id}`, {
        data: { quizId, title, difficulty, questions },
      });
      console.log(`PATCH  ${quizId}`);
    } else {
      await supabaseInsert("lesson_blocks", [{
        id: crypto.randomUUID(),
        lesson_id: lessonId,
        type: "assessment",
        engine: "quiz:mcq",
        position,
        data: { quizId, title, difficulty, questions },
      }]);
      console.log(`INSERT ${quizId} (pos ${position})`);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});

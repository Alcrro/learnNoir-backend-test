/**
 * Updates all 24 Programming Basics lesson content blocks with a full interactive structure:
 * predict → concept → think+steps → code → recall
 *
 * Run: node scripts/update-lesson-content.mjs
 */

const SUPABASE_URL = "https://ypdfaegmuxxxiamhswgk.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZGZhZWdtdXh4eGlhbWhzd2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQzMjYyMywiZXhwIjoyMDkwMDA4NjIzfQ.6v-24nO6Pi3NP39ZDPxY7p9BIcwlkC236zvGo2n8H7s";

async function query(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...opts.headers,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Supabase ${path}: ${JSON.stringify(json)}`);
  return json;
}

// ── Content factory per topic × language ─────────────────────────────────────

function makeLesson(topic, lang) {
  const T = TOPICS[topic];
  const L = T[lang];
  return [
    // 1. HOOK: activate prior knowledge before reading
    {
      type: "predict",
      question: L.predict,
    },
    // 2. KEY IDEA: abstract concept with sections
    {
      type: "concept",
      title: T.conceptTitle,
      sections: L.conceptSections,
    },
    // 3. ACTIVE STEPS: gated reveal
    {
      type: "think",
      question: L.thinkQuestion,
      revealLabel: "Am gândit — arată-mi pașii →",
      steps: L.steps,
    },
    // 4. CODE EXAMPLE: full working snippet
    {
      type: "code",
      language: lang === "cpp" ? "cpp" : lang === "java" ? "java" : lang === "javascript" ? "javascript" : "python",
      code: L.code,
    },
    // 5. EMBEDDED RECALL: 2 quick-check questions
    {
      type: "recall",
      placedAfter: "după pași",
      questions: L.recall,
    },
  ];
}

// ── Topic + language data ─────────────────────────────────────────────────────

const TOPICS = {
  "variables-data-types": {
    conceptTitle: "Ce este o variabilă?",
    python: {
      predict: "Dacă vrei să stochezi vârsta unui utilizator în Python, ce scrierezi? Gândește-te la sintaxă înainte să citești.",
      conceptSections: [
        { label: "Definiție", text: "O variabilă este un nume care referențiază o valoare stocată în memorie. Python deduce tipul automat — nu trebuie să îl declari." },
        { label: "Tipare dinamică", text: "Aceeași variabilă poate schimba tipul: x = 5, apoi x = 'hello'. Python nu se plânge, dar poate produce bug-uri subtile." },
        { label: "Tipuri primitive", text: "int (42), float (3.14), str ('hello'), bool (True/False) — cele 4 tipuri de bază pe care le vei folosi cel mai des." },
      ],
      thinkQuestion: "De ce Python nu cere să specifici tipul variabilei? Ce avantaje și ce dezavantaje produce asta?",
      steps: [
        { title: "Atribuie o valoare", description: "Scrie numele variabilei, semnul = și valoarea. Python crează variabila automat.", codeHint: "age = 25" },
        { title: "Alege tipul potrivit", description: "Numere întregi → int, numere cu zecimale → float, text → str, adevărat/fals → bool." },
        { title: "Verifică tipul cu type()", description: "type(x) returnează tipul curent al variabilei. Util pentru debugging." },
        { title: "F-string pentru afișare", description: "f\"{variabila}\" interpolează valoarea direct în string — cel mai modern mod de formatare.", codeHint: "f\"Vârsta: {age}\"" },
      ],
      recall: [
        { id: "v-py-1", question: "Ce returnează type(3.14) în Python?", options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'number'>"], correctIndex: 1, explanation: "3.14 este un număr cu zecimală → float. int este pentru numere întregi fără zecimală." },
        { id: "v-py-2", question: "Care sintaxă este corectă pentru a declara o variabilă în Python?", options: ["int age = 25;", "var age = 25", "age = 25", "let age = 25;"], correctIndex: 2, explanation: "Python nu cere tipul și nici var/let. Simplu: nume = valoare." },
      ],
      code: `# Variabile de tipuri diferite
name = "Alice"       # str
age = 25             # int
height = 1.75        # float
is_student = True    # bool

# F-string interpolation
print(f"{name} are {age} ani")

# Verifică tipul
print(type(name))    # <class 'str'>
print(type(age))     # <class 'int'>

# O variabilă poate schimba tipul
x = 42
print(type(x))   # <class 'int'>
x = "hello"
print(type(x))   # <class 'str'>`,
    },
    javascript: {
      predict: "Care e diferența dintre const și let în JavaScript? Gândește-te la un exemplu pentru fiecare.",
      conceptSections: [
        { label: "const vs let", text: "const = nu poate fi reasignat după declarare (folosit pentru valori constante). let = poate fi reasignat. Evită var — are scoping confuz și cauze de bug-uri." },
        { label: "Tipare dinamică", text: "Ca și Python, JS este dynamically typed. typeof returnează tipul la runtime." },
        { label: "Tipuri primitive", text: "string, number (atât int cât și float), boolean, null, undefined — cele mai comune. BigInt și Symbol sunt avansate." },
      ],
      thinkQuestion: "De ce ai folosi const în loc de let chiar dacă ești sigur că nu vei reasigna? Ce beneficii produce?",
      steps: [
        { title: "Declară cu const (implicit)", description: "Dacă valoarea nu se va schimba, prefer const. Semnalizezi intenția.", codeHint: "const PI = 3.14;" },
        { title: "Folosește let când reasignezi", description: "Dacă variabila se va modifica (contoare, acumulatori), folosești let.", codeHint: "let score = 0; score++;" },
        { title: "Verifică tipul cu typeof", description: "typeof x returnează un string cu tipul: 'string', 'number', 'boolean', etc." },
        { title: "Template literal pentru afișare", description: "Backtick + ${} pentru interpolarea variabilelor în string.", codeHint: "`Vârsta: ${age}`" },
      ],
      recall: [
        { id: "v-js-1", question: "Ce returnează typeof 42 în JavaScript?", options: ["'int'", "'number'", "'float'", "'integer'"], correctIndex: 1, explanation: "JS nu face distincție între int și float — toate numerele sunt 'number'. Spre deosebire de Python care distinge int de float." },
        { id: "v-js-2", question: "Care declarație va produce o eroare dacă încerc să reasignez?", options: ["let name = 'Alice'; name = 'Bob';", "const name = 'Alice'; name = 'Bob';", "var name = 'Alice'; name = 'Bob';", "Niciuna — toate permit reasignarea"], correctIndex: 1, explanation: "const nu permite reasignarea. Vei primi TypeError: Assignment to constant variable." },
      ],
      code: `const name = "Alice";   // const — nu se reasignează
let age = 25;           // let — poate fi modificat
const PI = 3.14159;

// Template literal
console.log(\`\${name} are \${age} ani\`);

// typeof
console.log(typeof name);   // 'string'
console.log(typeof age);    // 'number'
console.log(typeof true);   // 'boolean'

// Reasignare cu let
let score = 0;
score = score + 10;
console.log(score); // 10

// const cu obiect — proprietățile POT fi modificate
const user = { name: "Alice" };
user.name = "Bob"; // OK — nu reasignezi variabila, ci proprietatea`,
    },
    java: {
      predict: "De ce Java cere să specifici tipul variabilei (int, String, etc.) față de Python care nu o cere?",
      conceptSections: [
        { label: "Tipare statică", text: "Java este statically typed: tipul e declarat explicit și verificat la compile time. Erori de tip sunt prinse înainte de execuție." },
        { label: "Primitive vs Referință", text: "Java are 8 primitive (int, double, boolean, char, byte, short, long, float) și tipuri referință (String, arrays, obiecte). Primitivele sunt stocate direct pe stack — mai rapide." },
        { label: "final — echivalentul const", text: "final int MAX = 100; previne reasignarea. Convenție: SNAKE_UPPER_CASE pentru constante." },
      ],
      thinkQuestion: "Care e avantajul principal al tipării statice (Java) față de cea dinamică (Python)? Dar dezavantajul?",
      steps: [
        { title: "Declară cu tipul explicit", description: "Sintaxa: Tip numeVariabila = valoare;", codeHint: "int age = 25;" },
        { title: "Alege primitive sau String", description: "int/double/boolean pentru valori simple. String pentru text (cu S mare — e clasă, nu primitivă).", codeHint: "String name = \"Alice\";" },
        { title: "final pentru constante", description: "Adaugă final înainte de tip pentru a preveni reasignarea.", codeHint: "final int MAX = 100;" },
        { title: "var (Java 10+)", description: "var permite inferarea tipului la fel ca Python, dar tipul rămâne fix după declarare.", codeHint: "var message = \"hello\"; // String" },
      ],
      recall: [
        { id: "v-java-1", question: "Care tipuri sunt primitive în Java?", options: ["String și int", "int, double, boolean", "Integer, Double, Boolean", "String, int, array"], correctIndex: 1, explanation: "int, double, boolean sunt primitive. String este o clasă (tip referință) — de aceea se scrie cu S mare și are metode ca .length(), .toUpperCase() etc." },
        { id: "v-java-2", question: "Ce face final în declararea unei variabile?", options: ["O face publică", "Previne reasignarea valorii", "O transformă în metodă statică", "O face globală"], correctIndex: 1, explanation: "final previne reasignarea după inițializare. Echivalentul lui const din JS sau al convențiilor de constante din Python." },
      ],
      code: `public class Variables {
    public static void main(String[] args) {
        // Primitive
        int age = 25;
        double height = 1.75;
        boolean isStudent = true;
        char grade = 'A';

        // Tip referință
        String name = "Alice";

        // final = constant
        final int MAX_SCORE = 100;

        // var (Java 10+) — tipul e dedus
        var score = 95; // int

        // Printf pentru formatare
        System.out.printf("%s are %d ani, inaltime %.2fm%n",
                          name, age, height);

        // Verificare tip la runtime
        System.out.println(name.getClass().getSimpleName()); // String
    }
}`,
    },
    cpp: {
      predict: "Cum crezi că C++ gestionează tipurile variabilelor? E mai aproape de Python (dinamic) sau Java (static)?",
      conceptSections: [
        { label: "Tipare statică strictă", text: "C++ este statically typed ca Java. Tipul se specifică la declarare și compilatorul verifică compatibilitatea. Erorile de tip sunt prinse la compile time." },
        { label: "auto — inferarea tipului", text: "auto permite compilatorului să deducă tipul din valoarea inițializată (C++11+). Similar cu var din Java 10 — tipul tot rămâne fix după declarare." },
        { label: "const", text: "const previne modificarea valorii după inițializare. Bune practici: constexpr pentru valori evaluate la compile time." },
      ],
      thinkQuestion: "De ce C++ are nevoie de #include <string> pentru a folosi std::string, deși int și double sunt disponibile fără include?",
      steps: [
        { title: "Declară cu tip explicit", description: "Sintaxa: tip numeVariabila = valoare;", codeHint: "int age = 25;" },
        { title: "std::string pentru text", description: "Include <string> și folosești std::string. char* este stilul C-vechi — evit în C++ modern.", codeHint: "#include <string>\nstd::string name = \"Alice\";" },
        { title: "auto pentru inferare", description: "auto deduce tipul din valoarea inițializată. Tipul rămâne fix — nu e ca Python.", codeHint: "auto score = 95; // int" },
        { title: "const pentru valori fixe", description: "const previne modificarea. constexpr evaluează la compile time (mai eficient).", codeHint: "const double PI = 3.14;" },
      ],
      recall: [
        { id: "v-cpp-1", question: "Ce face auto în C++?", options: ["Alocă memorie automat", "Permite schimbarea tipului ca în Python", "Compilatorul deduce tipul din valoarea inițializată", "Declară o variabilă globală"], correctIndex: 2, explanation: "auto în C++ = inferarea tipului la compile time. Tipul e dedus o dată și rămâne fix. Nu e ca Python unde tipul se poate schimba." },
        { id: "v-cpp-2", question: "Care header trebuie inclus pentru std::string?", options: ["<iostream>", "<string>", "<cstring>", "Nu e necesar niciun header"], correctIndex: 1, explanation: "#include <string> aduce std::string. <iostream> aduce cout/cin. <cstring> conține funcții pentru char* (stil C-vechi)." },
      ],
      code: `#include <iostream>
#include <string>

int main() {
    // Declarare cu tip explicit
    int age = 25;
    double height = 1.75;
    bool isStudent = true;
    std::string name = "Alice";

    // auto — tip dedus de compilator
    auto score = 95;    // dedus ca int
    auto pi = 3.14159;  // dedus ca double

    // const — valoare fixă
    const int MAX_SCORE = 100;

    // Output cu cout
    std::cout << name << " are " << age << " ani\\n";
    std::cout << "Inaltime: " << height << "m\\n";
    std::cout << "Score: " << score << "/" << MAX_SCORE << "\\n";

    return 0;
}`,
    },
  },

  "control-flow-if-else": {
    conceptTitle: "Control flow — ramificarea execuției",
    python: {
      predict: "Dacă score = 85, ce nota ar trebui să primească: A (≥90), B (≥80), C (≥70), D (≥60), F (rest)? Scrie logica în cap înainte să citești.",
      conceptSections: [
        { label: "Definiție", text: "Control flow determină ordinea în care instrucțiunile se execută. if/elif/else permite execuția condițională — codul rulează numai dacă condiția e True." },
        { label: "Indentare în Python", text: "Python folosește indentarea (4 spații) pentru a delimita blocurile — nu există {} ca în alte limbaje. Indentarea incorectă = eroare de sintaxă." },
        { label: "Evaluare condiții", text: "Orice expresie Python poate fi condiție. 0, None, '', [], {} sunt falsy. Orice altceva e truthy." },
      ],
      thinkQuestion: "Ce se întâmplă dacă score = 75? Câte condiții evaluează Python înainte să execute codul potrivit?",
      steps: [
        { title: "if — verifică prima condiție", description: "Dacă True, execută blocul și sare restul elif/else.", codeHint: "if score >= 90:" },
        { title: "elif — condiții alternative", description: "Se evaluează numai dacă toate condițiile de deasupra au fost False.", codeHint: "elif score >= 80:" },
        { title: "else — cazul default", description: "Se execută dacă TOATE condițiile if/elif au fost False. Nu are condiție.", codeHint: "else:" },
        { title: "Operatori logici", description: "and (ambele true), or (cel puțin una true), not (inversează).", codeHint: "if age >= 18 and has_id:" },
      ],
      recall: [
        { id: "cf-py-1", question: "Cu score = 85, ce bloc se execută?", options: ["if score >= 90", "elif score >= 80", "elif score >= 70", "else"], correctIndex: 1, explanation: "85 >= 90 este False → skip. 85 >= 80 este True → execută elif score >= 80. Python se oprește la primul bloc True și nu verifică restul." },
        { id: "cf-py-2", question: "Care valoare este falsy în Python?", options: ["1", "' '", "[]", "True"], correctIndex: 2, explanation: "Lista goală [] este falsy. Spațiul ' ' este truthy (are caracter). 1 și True sunt truthy." },
      ],
      code: `score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"    # Acesta se execută pentru 85
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Scor: {score} → Nota: {grade}")  # B

# Operatori logici
age, has_ticket = 20, True
if age >= 18 and has_ticket:
    print("Acces permis")
elif age < 18:
    print("Trebuie să ai 18+ ani")
else:
    print("Ai nevoie de bilet")

# Ternar — if/else pe o linie
status = "adult" if age >= 18 else "minor"
print(status)  # adult`,
    },
    javascript: {
      predict: "Cum crezi că JS gestionează condițiile? Scrie în cap un if/else pentru 'dacă vârsta >= 18, afișează adult, altfel minor'.",
      conceptSections: [
        { label: "Blocuri cu {}", text: "JS folosește acolade {} pentru a delimita blocurile. Spre deosebire de Python, indentarea e estetică — {} determină structura." },
        { label: "Truthy/Falsy", text: "JS are mai mulți falsy: false, 0, '', null, undefined, NaN. Restul sunt truthy. Atenție la 0 și string gol!" },
        { label: "Operatorul ternar", text: "conditie ? valoareTrue : valoreFalse — sintaxa concisă pentru un if/else simplu cu o singură expresie." },
      ],
      thinkQuestion: "De ce e periculos să compari cu == în JS? Ce diferență e între == și ===?",
      steps: [
        { title: "if/else de bază", description: "Condiția se evaluează la boolean. {} delimitează blocul.", codeHint: "if (condition) { } else { }" },
        { title: "else if pentru ramuri multiple", description: "Înlănțuiești else if pentru mai multe cazuri. La fel cu elif din Python.", codeHint: "else if (score >= 80) { }" },
        { title: "=== vs == (strict vs loose)", description: "Preferă întotdeauna === (verifică și tipul). == face conversii implicite care pot surprinde.", codeHint: "0 == '0' // true (!!)\n0 === '0' // false" },
        { title: "Operatorul ternar", description: "Pentru expresii simple — mai scurt decât if/else.", codeHint: "const s = age >= 18 ? 'adult' : 'minor';" },
      ],
      recall: [
        { id: "cf-js-1", question: "Ce afișează: console.log(0 == '0')?", options: ["false", "true", "TypeError", "undefined"], correctIndex: 1, explanation: "== face type coercion: '0' e convertit la 0, deci 0 == 0 este true. Acesta e motivul pentru care preferăm === care returnează false." },
        { id: "cf-js-2", question: "Care valoare este truthy în JS?", options: ["0", "''", "null", "'0'"], correctIndex: 3, explanation: "String-ul '0' este truthy — orice string non-gol e truthy, indiferent de conținut. 0, '', null sunt falsy." },
      ],
      code: `const score = 85;
let grade;

if (score >= 90) {
  grade = 'A';
} else if (score >= 80) {
  grade = 'B';  // Acesta se execută
} else if (score >= 70) {
  grade = 'C';
} else {
  grade = 'F';
}

console.log(\`Scor: \${score} → Nota: \${grade}\`); // B

// === vs ==
console.log(0 === '0'); // false (diferit tip)
console.log(0 == '0');  // true (type coercion — periculos!)

// Operatorul ternar
const age = 20;
const status = age >= 18 ? 'adult' : 'minor';
console.log(status); // adult

// Operatori logici cu short-circuit
const hasTicket = true;
if (age >= 18 && hasTicket) {
  console.log("Acces permis");
}`,
    },
    java: {
      predict: "În Java, condiția din if trebuie să fie de tip boolean. De ce e asta o diferență față de Python sau JS?",
      conceptSections: [
        { label: "Boolean strict", text: "Java cere condiție de tip boolean — nu acceptă valori truthy/falsy ca JS/Python. if (1) produce eroare de compilare." },
        { label: "switch expression (Java 14+)", text: "Java modernă are switch expressions cu -> care elimină necesitatea de break și returnează valori direct." },
        { label: "Operatorul ternar", text: "Tip returnType var = conditie ? valTrue : valFalse; — același pattern ca JS." },
      ],
      thinkQuestion: "De ce Java nu acceptă if (myString) pentru a verifica dacă un String e non-null? Cum verifici corect?",
      steps: [
        { title: "if/else cu boolean strict", description: "Condiția trebuie să evalueze la boolean. Nu poți scrie if (count) — trebuie if (count > 0).", codeHint: "if (score >= 90) { }" },
        { title: "else if pentru ramuri multiple", description: "Înlănțuiești cu else if. La fel ca în alte limbaje.", codeHint: "else if (score >= 80) { }" },
        { title: ".equals() pentru String", description: "NICIODATĂ == pentru conținut String. == compară referințe, nu conținut.", codeHint: "if (name.equals(\"Alice\")) { }" },
        { title: "Operatorul ternar", description: "Tip var = cond ? valTrue : valFalse;", codeHint: "String s = age >= 18 ? \"adult\" : \"minor\";" },
      ],
      recall: [
        { id: "cf-java-1", question: "Ce eroare produce if (1) { } în Java?", options: ["RuntimeException", "Eroare de compilare (incompatibil tip)", "NullPointerException", "Nicio eroare — funcționează"], correctIndex: 1, explanation: "Java cere condiție boolean. 1 este int, nu boolean → eroare de compilare. Trebuie if (x == 1) sau if (x != 0)." },
        { id: "cf-java-2", question: "Cum compari corect două String-uri în Java?", options: ["if (s1 == s2)", "if (s1.equals(s2))", "if (s1 === s2)", "if (s1.compareTo(s2))"], correctIndex: 1, explanation: ".equals() compară conținutul. == compară referințele (adresele din memorie). Două String-uri cu același conținut pot fi obiecte diferite → == poate returna false chiar dacă sunt identice." },
      ],
      code: `public class ControlFlow {
    public static void main(String[] args) {
        int score = 85;
        char grade;

        if (score >= 90) {
            grade = 'A';
        } else if (score >= 80) {
            grade = 'B';  // Acesta se execută
        } else if (score >= 70) {
            grade = 'C';
        } else {
            grade = 'F';
        }

        System.out.printf("Scor: %d → Nota: %c%n", score, grade);

        // String comparison cu .equals()
        String name = "Alice";
        if (name.equals("Alice")) {
            System.out.println("Bun venit, Alice!");
        }

        // Operatorul ternar
        int age = 20;
        String status = age >= 18 ? "adult" : "minor";
        System.out.println(status); // adult

        // Operatori logici
        boolean hasTicket = true;
        if (age >= 18 && hasTicket) {
            System.out.println("Acces permis");
        }
    }
}`,
    },
    cpp: {
      predict: "C++ acceptă if (0) sau if (nullptr)? Ce valori sunt false în C++?",
      conceptSections: [
        { label: "Conversie la bool", text: "C++ convertește orice la bool: 0, 0.0, nullptr, '\\0' sunt false. Orice altceva e true. Spre deosebire de Java care cere boolean strict." },
        { label: "Operatorul ternar", text: "Identic cu Java/JS: cond ? valTrue : valFalse." },
        { label: "switch", text: "switch(expr) cu case și break. Fără break, execuția 'cade' în case-ul următor (fallthrough)." },
      ],
      thinkQuestion: "De ce C++ acceptă if (ptr) pentru a verifica dacă un pointer e non-null, dar Java nu permite if (obj)?",
      steps: [
        { title: "if/else cu conversie implicită", description: "Orice expresie convertibilă la bool funcționează ca condiție.", codeHint: "if (count > 0) { } // sau if (ptr) { }" },
        { title: "else if pentru ramuri multiple", description: "Identic cu alte limbaje.", codeHint: "else if (score >= 80) { }" },
        { title: "Operatorul ternar", description: "Funcționează la fel ca în Java/JS.", codeHint: "std::string s = age >= 18 ? \"adult\" : \"minor\";" },
        { title: "switch cu break obligatoriu", description: "Fără break, execuția continuă în case-ul următor (fallthrough). Uneori util, deseori bug.", codeHint: "case 'A': ...; break;" },
      ],
      recall: [
        { id: "cf-cpp-1", question: "Ce valori sunt false (falsy) în C++?", options: ["0, nullptr, false", "0, null, false, ''", "false, None, 0", "0, 0.0, nullptr, '\\0', false"], correctIndex: 3, explanation: "C++ convertește la bool: 0 (int), 0.0 (double), nullptr (pointer nul), '\\0' (char nul) și false sunt toate false. Mai larg decât Java, mai îngust decât JS." },
        { id: "cf-cpp-2", question: "Ce se întâmplă dacă uiți break într-un case din switch?", options: ["Eroare de compilare", "RuntimeError", "Execuția continuă în case-ul următor (fallthrough)", "Switch se oprește automat"], correctIndex: 2, explanation: "Fallthrough: fără break, execuția 'cade' în case-ul următor și îl execută. Poate fi intenționat (rare) sau un bug clasic." },
      ],
      code: `#include <iostream>
#include <string>

int main() {
    int score = 85;
    char grade;

    if (score >= 90) {
        grade = 'A';
    } else if (score >= 80) {
        grade = 'B';  // Acesta se execută
    } else if (score >= 70) {
        grade = 'C';
    } else {
        grade = 'F';
    }

    std::cout << "Scor: " << score << " → Nota: " << grade << "\\n";

    // Conversie implicită la bool
    int count = 5;
    if (count) {  // 5 != 0 → true
        std::cout << "Count e non-zero\\n";
    }

    // Operatorul ternar
    int age = 20;
    std::string status = (age >= 18) ? "adult" : "minor";
    std::cout << status << "\\n";

    // switch cu break
    switch (grade) {
        case 'A': std::cout << "Excelent!\\n"; break;
        case 'B': std::cout << "Bine!\\n"; break;
        default:  std::cout << "Continuă!\\n"; break;
    }

    return 0;
}`,
    },
  },

  "loops-for-while": {
    conceptTitle: "Bucle — repetarea execuției",
    python: {
      predict: "Scrie în cap cum ai calcula suma numerelor 1 până la 100 fără buclă. Acum gândește-te cum o buclă simplifică asta.",
      conceptSections: [
        { label: "for vs while", text: "for parcurge o colecție sau un range (știi câte iterații). while continuă cât timp o condiție e True (numărul de iterații poate varia)." },
        { label: "range()", text: "range(n) generează 0..n-1. range(start, stop) generează start..stop-1. range(start, stop, step) controlează pasul." },
        { label: "break și continue", text: "break iese complet din buclă. continue sare la iterația următoare, ignorând codul de sub." },
      ],
      thinkQuestion: "Suma 1+2+...+100 — câte iterații execută bucla? De ce nu e mai eficient să calculezi direct cu formula n*(n+1)/2?",
      steps: [
        { title: "for cu range()", description: "range(1, 101) generează 1, 2, ..., 100. Stop-ul e exclusiv.", codeHint: "for i in range(1, 101):" },
        { title: "for peste colecție", description: "Iterezi direct elementele — nu ai nevoie de index.", codeHint: "for item in my_list:" },
        { title: "while cu condiție", description: "Condiția e re-evaluată la fiecare iterație. Atenție: dacă nu modifici condiția, bucla e infinită.", codeHint: "while count < 5:\n    count += 1" },
        { title: "enumerate() pentru index + valoare", description: "Când ai nevoie de ambele — index și valoare — enumerate() e soluția.", codeHint: "for i, val in enumerate(my_list):" },
      ],
      recall: [
        { id: "l-py-1", question: "Ce generează range(2, 10, 3)?", options: ["[2, 5, 8]", "[2, 4, 6, 8]", "[2, 3, 4, 5, 6, 7, 8, 9]", "[2, 5, 8, 11]"], correctIndex: 0, explanation: "range(start=2, stop=10, step=3): 2, 2+3=5, 5+3=8, 8+3=11≥10 stop. Rezultat: [2, 5, 8]. Stop-ul e exclusiv." },
        { id: "l-py-2", question: "Ce face continue într-o buclă for?", options: ["Iese din buclă", "Sare la iterația următoare", "Repornește bucla de la 0", "Nu face nimic"], correctIndex: 1, explanation: "continue sare codul rămas din iterația curentă și trece la următoarea. break ar fi ieșit complet din buclă." },
      ],
      code: `# for cu range — suma 1-100
total = 0
for i in range(1, 101):
    total += i
print(f"Suma 1-100 = {total}")  # 5050 (= 100*101/2)

# for peste listă
languages = ["Python", "JavaScript", "Java", "C++"]
for lang in languages:
    print(f"  - {lang}")

# enumerate — index + valoare
for i, lang in enumerate(languages):
    print(f"  {i+1}. {lang}")

# while — contorizare cu condiție
count = 0
while count < 5:
    print(count, end=" ")  # 0 1 2 3 4
    count += 1

# break și continue
for i in range(10):
    if i == 7: break       # oprire la 7
    if i % 2 == 0: continue  # sari pari
    print(i, end=" ")      # 1 3 5`,
    },
    javascript: {
      predict: "Care e diferența dintre for (let i...) și for...of în JavaScript? Când ai folosi fiecare?",
      conceptSections: [
        { label: "for clasic", text: "for (init; cond; increment) — controlezi complet toate fazele. Util când ai nevoie de index sau pas non-standard." },
        { label: "for...of", text: "Iterează valorile unui iterable (array, string, Map, Set). Mai lizibil, fără index manual." },
        { label: "Array methods", text: "forEach, map, filter, reduce sunt preferate în JS modern față de bucle imperative — cod declarativ, fără side effects." },
      ],
      thinkQuestion: "De ce map() e preferată față de for clasic în JS modern? Ce diferență produce în lizibilitatea codului?",
      steps: [
        { title: "for clasic cu index", description: "Când ai nevoie de i sau de control fin pe iterare.", codeHint: "for (let i = 0; i < arr.length; i++)" },
        { title: "for...of pentru valori", description: "Cel mai simplu mod de a parcurge un array.", codeHint: "for (const item of arr)" },
        { title: "while", description: "Continuă cât timp condiția e truthy.", codeHint: "while (condition) { }" },
        { title: "map/filter/reduce", description: "Funcționale — returnează array nou, nu modifică originalul.", codeHint: "arr.map(x => x * 2)" },
      ],
      recall: [
        { id: "l-js-1", question: "Ce returnează [1,2,3,4,5].filter(n => n % 2 === 0)?", options: ["[1,3,5]", "[2,4]", "[0,2,4]", "[1,2,3,4,5]"], correctIndex: 1, explanation: "filter returnează un array nou cu elementele pentru care funcția returnează true. 2%2=0 (true), 4%2=0 (true). Rezultat: [2, 4]." },
        { id: "l-js-2", question: "Care metodă transformă fiecare element și returnează un array nou?", options: ["forEach", "filter", "map", "reduce"], correctIndex: 2, explanation: "map transformă fiecare element aplicând o funcție și returnează un array nou de aceeași lungime. forEach face același lucru dar returnează undefined." },
      ],
      code: `// for clasic — suma 1-100
let total = 0;
for (let i = 1; i <= 100; i++) {
  total += i;
}
console.log(\`Suma 1-100 = \${total}\`); // 5050

// for...of — simplu, fără index
const languages = ["Python", "JavaScript", "Java", "C++"];
for (const lang of languages) {
  console.log(\`  - \${lang}\`);
}

// while
let n = 1;
while (n <= 10) {
  if (n % 2 === 0) process.stdout.write(n + " ");
  n++;
}
// 2 4 6 8 10

// Array methods — stil modern
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens   = numbers.filter(n => n % 2 === 0);
const squares = evens.map(n => n ** 2);
const sum     = evens.reduce((acc, n) => acc + n, 0);

console.log(evens);   // [2, 4, 6, 8, 10]
console.log(squares); // [4, 16, 36, 64, 100]
console.log(sum);     // 30`,
    },
    java: {
      predict: "Java are for-each (for (String s : list)) și for clasic. Când ai folosi fiecare?",
      conceptSections: [
        { label: "for clasic", text: "for (init; cond; increment) — identic cu C/C++/JS. Când ai nevoie de index sau pas non-1." },
        { label: "for-each (enhanced for)", text: "for (Tip elem : colectie) — fără index, mai lizibil pentru parcurgere simplă." },
        { label: "do-while", text: "Garantează că blocul se execută cel puțin o dată, indiferent de condiție. Util pentru menus și validare input." },
      ],
      thinkQuestion: "De ce do-while garantează cel puțin o execuție? Gândește-te la un caz de utilizare concret.",
      steps: [
        { title: "for clasic cu index", description: "for (int i = 0; i < n; i++) — clasic pentru array-uri cu index.", codeHint: "for (int i = 0; i < arr.length; i++)" },
        { title: "for-each pentru colecții", description: "for (String item : list) — fără index, imposibil să modifici indexul.", codeHint: "for (String lang : languages)" },
        { title: "while cu condiție", description: "Condițional. Poate să nu execute deloc dacă condiția e false din start.", codeHint: "while (count < max)" },
        { title: "do-while pentru cel puțin o execuție", description: "Condiția e verificată DUPĂ prima execuție. Util pentru meniu sau validare.", codeHint: "do { ... } while (condition);" },
      ],
      recall: [
        { id: "l-java-1", question: "Când e util do-while față de while?", options: ["Când vrei performanță mai bună", "Când blocul trebuie executat cel puțin o dată", "Când iterezi liste", "Nu există diferență funcțională"], correctIndex: 1, explanation: "do-while e util când vrei să rulezi codul o dată înainte de a verifica condiția — ex: afișezi un meniu și verifici dacă user-ul vrea să continue." },
        { id: "l-java-2", question: "Ce diferență e între for clasic și for-each în Java?", options: ["for-each e mai rapid", "for clasic îți dă acces la index, for-each nu", "for-each funcționează doar cu arrays", "Nu există diferență"], correctIndex: 1, explanation: "for-each ascunde indexul și iteratorul — mai simplu și mai lizibil, dar nu poți accesa i sau modifica indexul în mijlocul parcurgerii." },
      ],
      code: `import java.util.ArrayList;
import java.util.Arrays;

public class Loops {
    public static void main(String[] args) {
        // for clasic — suma 1-100
        int total = 0;
        for (int i = 1; i <= 100; i++) {
            total += i;
        }
        System.out.println("Suma 1-100 = " + total); // 5050

        // for-each
        String[] languages = {"Python", "JavaScript", "Java", "C++"};
        for (String lang : languages) {
            System.out.println("  - " + lang);
        }

        // while
        int n = 1;
        while (n <= 10) {
            if (n % 2 == 0) System.out.print(n + " ");
            n++;
        }
        System.out.println(); // 2 4 6 8 10

        // do-while — se execută cel puțin o dată
        int attempts = 0;
        do {
            System.out.println("Incercarea " + (++attempts));
        } while (attempts < 3);
    }
}`,
    },
    cpp: {
      predict: "C++ are range-based for (din C++11). Cum crezi că arată sintaxa? E asemănător cu for-each din Java?",
      conceptSections: [
        { label: "for clasic (C-style)", text: "for (init; cond; step) — identic cu C, Java, JS. Familiar și direct." },
        { label: "range-based for (C++11)", text: "for (auto elem : container) — iterează vectori, arrays, etc. Similar cu for-each din Java." },
        { label: "while și do-while", text: "Identice semantic cu Java. do-while garantează cel puțin o execuție." },
      ],
      thinkQuestion: "De ce e recomandat const auto& în loc de auto în range-based for pentru obiecte mari?",
      steps: [
        { title: "for clasic", description: "for (int i = 0; i < n; i++) — identic cu C/Java/JS.", codeHint: "for (int i = 0; i < v.size(); i++)" },
        { title: "range-based for", description: "for (const auto& elem : container) — const = nu modifici, & = fără copie.", codeHint: "for (const auto& lang : languages)" },
        { title: "while", description: "Identic semantic cu alte limbaje.", codeHint: "while (count < max) { }" },
        { title: "Algoritmi STL — alternativa modernă", description: "std::for_each, std::transform din <algorithm> — echivalentul lui map/filter din JS.", codeHint: "std::for_each(v.begin(), v.end(), fn)" },
      ],
      recall: [
        { id: "l-cpp-1", question: "De ce folosim const auto& în loc de auto în range-based for?", options: ["const împiedică modificarea; & evită copierea obiectului", "auto e mai lent", "& face codul mai rapid fără alt efect", "Nu există diferență"], correctIndex: 0, explanation: "& (referință) evită copierea obiectului — important pentru string-uri și obiecte mari. const previne modificarea accidentală a elementului din container." },
        { id: "l-cpp-2", question: "Care header include std::sort?", options: ["<vector>", "<algorithm>", "<numeric>", "<cstdlib>"], correctIndex: 1, explanation: "<algorithm> conține std::sort, std::find, std::for_each etc. <vector> conține std::vector. <numeric> conține std::accumulate." },
      ],
      code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    // for clasic — suma 1-100
    int total = 0;
    for (int i = 1; i <= 100; i++) {
        total += i;
    }
    std::cout << "Suma 1-100 = " << total << "\\n"; // 5050

    // range-based for
    std::vector<std::string> languages = {"Python", "JavaScript", "Java", "C++"};
    for (const auto& lang : languages) {
        std::cout << "  - " << lang << "\\n";
    }

    // while
    int n = 1;
    while (n <= 10) {
        if (n % 2 == 0) std::cout << n << " ";
        n++;
    }
    std::cout << "\\n"; // 2 4 6 8 10

    // STL algorithms — stil modern
    std::vector<int> nums = {1, 2, 3, 4, 5};
    int sum = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "Sum: " << sum << "\\n"; // 15

    return 0;
}`,
    },
  },

  "functions": {
    conceptTitle: "Funcții — cod reutilizabil cu nume",
    python: {
      predict: "Dacă trebuie să calculezi aria unui cerc de 5 ori cu raze diferite, cum ai organiza codul fără să repeți formula?",
      conceptSections: [
        { label: "Definiție", text: "O funcție este un bloc de cod reutilizabil cu un nume, parametri (input) și valoare returnată (output). Reduce duplicarea și crește lizibilitatea." },
        { label: "First-class functions", text: "În Python funcțiile sunt obiecte: pot fi pasate ca argumente, returnate din alte funcții, stocate în variabile sau liste." },
        { label: "Type hints (Python 3.5+)", text: "def add(a: int, b: int) -> int: — adaugi tipuri pentru documentare și IDE support. Nu sunt obligatorii, dar sunt bune practici." },
      ],
      thinkQuestion: "De ce e utile valorile default pentru parametri? Când pot cauza bug-uri (mai ales cu valori mutabile)?",
      steps: [
        { title: "Definești cu def", description: "def numeFunc(param1, param2): urmat de corpul indentat.", codeHint: "def greet(name):\n    return f\"Salut, {name}!\"" },
        { title: "Valori default pentru parametri", description: "Parametrii cu default sunt opționali la apel. ATENȚIE: nu folosi liste/dicte ca default!", codeHint: "def power(base, exp=2):\n    return base ** exp" },
        { title: "Type hints opționale", description: "Adaugi -> tip pentru return și tip: pentru parametri. Nu afectează execuția.", codeHint: "def add(a: int, b: int) -> int:" },
        { title: "Lambda — funcție anonimă", description: "lambda args: expresie — pentru funcții simple de o linie, folosite adesea cu map/filter.", codeHint: "square = lambda x: x ** 2" },
      ],
      recall: [
        { id: "f-py-1", question: "Ce returnează power(3) dacă def power(base, exp=2): return base**exp?", options: ["6 (3*2)", "9 (3²)", "8 (2³)", "EroareSintaxă"], correctIndex: 1, explanation: "exp are valoarea default 2. Deci power(3) = power(3, 2) = 3² = 9. Parametrul default e folosit când nu e furnizat argument." },
        { id: "f-py-2", question: "Care este valoarea lambda x: x * 2 apelată cu 5?", options: ["2", "10", "25", "None"], correctIndex: 1, explanation: "lambda x: x * 2 este echivalentul lui def f(x): return x * 2. Apelată cu 5 → 5 * 2 = 10." },
      ],
      code: `# Funcție de bază cu type hints
def greet(name: str) -> str:
    return f"Salut, {name}!"

# Valori default
def power(base: float, exp: int = 2) -> float:
    return base ** exp

# Funcție cu mai mulți parametri
def calculate_bmi(weight: float, height: float) -> float:
    return weight / (height ** 2)

# Lambda
square = lambda x: x ** 2
double = lambda x: x * 2

# Recursivitate
def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Higher-order function
def apply_twice(fn, value):
    return fn(fn(value))

print(greet("Alice"))                        # Salut, Alice!
print(power(3))                              # 9.0
print(power(2, 10))                          # 1024.0
print(f"BMI: {calculate_bmi(70, 1.75):.1f}") # BMI: 22.9
print(factorial(5))                          # 120
print(apply_twice(double, 3))               # 12`,
    },
    javascript: {
      predict: "Câte moduri știi de a defini o funcție în JavaScript? Scrie un exemplu pentru fiecare în cap.",
      conceptSections: [
        { label: "Function declaration vs expression", text: "Declaration: function f() {} — hoisted (poți apela înainte de declarare). Expression: const f = function() {} sau const f = () => {} — nu e hoisted." },
        { label: "Arrow functions", text: "() => {} — sintaxă concisă, nu au propriul this. Preferabile pentru callbacks și funcții scurte." },
        { label: "Higher-order functions", text: "Funcții care primesc sau returnează alte funcții. Baza JS modern: map, filter, reduce, setTimeout, EventListeners." },
      ],
      thinkQuestion: "De ce arrow functions nu au propriul this? În ce situație produce asta un avantaj față de function regulat?",
      steps: [
        { title: "Function declaration", description: "Hoisted — poate fi apelată înainte de declarare.", codeHint: "function greet(name) { return `Salut, ${name}!`; }" },
        { title: "Arrow function", description: "Sintaxă concisă, no this. Preferabilă pentru callbacks.", codeHint: "const greet = name => `Salut, ${name}!`;" },
        { title: "Default parameters", description: "Ca în Python: param = valoareDefault.", codeHint: "function power(base, exp = 2) { return base ** exp; }" },
        { title: "Higher-order functions", description: "Pasezi funcții ca argumente sau le returnezi.", codeHint: "const double = x => x * 2;\n[1,2,3].map(double);" },
      ],
      recall: [
        { id: "f-js-1", question: "Ce e hoisting în contextul funcțiilor JS?", options: ["Funcția e copiată la vârful fișierului la runtime", "Function declarations pot fi apelate înainte de declarare", "Arrow functions sunt mai rapide", "const funcțiile nu pot fi apelate"], correctIndex: 1, explanation: "Hoisting: JS mută function declarations la vârful scope-ului la compile time. Deci poți scrie apelul înainte de declarare. Arrow functions (const f = () => {}) nu sunt hoisted." },
        { id: "f-js-2", question: "Ce returnează [1,2,3].map(x => x ** 2)?", options: ["[1,4,9]", "[2,4,6]", "9", "[1,2,3]"], correctIndex: 0, explanation: "map aplică funcția pe fiecare element și returnează un array nou. 1²=1, 2²=4, 3²=9 → [1, 4, 9]." },
      ],
      code: `// Function declaration — hoisted
function greet(name) {
  return \`Salut, \${name}!\`;
}

// Arrow function
const calculateBMI = (weight, height) => weight / height ** 2;

// Default parameters
const power = (base, exp = 2) => base ** exp;

// Recursivitate
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Higher-order function
function applyTwice(fn, value) {
  return fn(fn(value));
}

// Closure
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();

console.log(greet("Alice"));                     // Salut, Alice!
console.log(power(3));                           // 9
console.log(factorial(5));                       // 120
console.log(applyTwice(x => x * 3, 2));        // 18
console.log(counter(), counter(), counter());   // 1 2 3`,
    },
    java: {
      predict: "De ce în Java funcțiile se numesc 'metode'? Ce înseamnă că o metodă e 'statică'?",
      conceptSections: [
        { label: "Metode, nu funcții", text: "În Java, funcțiile trăiesc întotdeauna în clase și se numesc metode. static înseamnă că aparțin clasei, nu unui obiect." },
        { label: "Tipul de return obligatoriu", text: "Orice metodă trebuie să declare tipul returnat. void = nu returnează nimic. Compilatorul verifică că toate ramurile returnează valori." },
        { label: "Method overloading", text: "Poți defini mai multe metode cu același nume dar parametri diferiți. Java alege metoda corectă la compile time." },
      ],
      thinkQuestion: "Ce înseamnă method overloading? De ce e util să ai add(int, int) și add(double, double)?",
      steps: [
        { title: "Semnătura metodei", description: "modificator tipReturn numeMetoda(Tip param) { ... }", codeHint: "public static String greet(String name)" },
        { title: "Returnezi cu return", description: "Dacă tipul return nu e void, trebuie return în toate ramurile.", codeHint: "return \"Salut, \" + name + \"!\";" },
        { title: "Overloading — same name, diff params", description: "Java distinge metodele după tipul și numărul parametrilor.", codeHint: "static int add(int a, int b)\nstatic double add(double a, double b)" },
        { title: "Recursivitate", description: "Metoda se apelează pe sine. Obligatoriu: caz de bază care oprește recursia.", codeHint: "if (n <= 1) return 1;\nreturn n * factorial(n-1);" },
      ],
      recall: [
        { id: "f-java-1", question: "Ce înseamnă void ca tip return al unei metode?", options: ["Metoda nu are parametri", "Metoda nu returnează nicio valoare", "Metoda e privată", "Metoda e statică"], correctIndex: 1, explanation: "void = metoda execută cod dar nu returnează nimic. Nu există return cu valoare. Metode void sunt pentru efecte secundare (print, modificare stare)." },
        { id: "f-java-2", question: "Poți defini două metode add(int,int) și add(double,double) în aceeași clasă?", options: ["Nu — duplicate", "Da — method overloading", "Da, dar doar dacă sunt în clase diferite", "Nu — void e obligatoriu"], correctIndex: 1, explanation: "Method overloading: Java permite mai multe metode cu același nume dacă au parametri diferiți. Alege la compile time metoda potrivită după tipul argumentelor." },
      ],
      code: `public class Functions {

    // Metodă care returnează String
    public static String greet(String name) {
        return "Salut, " + name + "!";
    }

    // Metodă cu parametru default simulat prin overloading
    public static int power(int base) {
        return base * base; // exp = 2 implicit
    }
    public static int power(int base, int exp) {
        int result = 1;
        for (int i = 0; i < exp; i++) result *= base;
        return result;
    }

    // Recursivitate
    public static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    // Metodă void — fără return cu valoare
    public static void printBMI(double weight, double height) {
        double bmi = weight / (height * height);
        System.out.printf("BMI: %.1f%n", bmi);
    }

    public static void main(String[] args) {
        System.out.println(greet("Alice"));  // Salut, Alice!
        System.out.println(power(3));        // 9
        System.out.println(power(2, 10));    // 1024
        System.out.println(factorial(10));   // 3628800
        printBMI(70, 1.75);                  // BMI: 22.9
    }
}`,
    },
    cpp: {
      predict: "C++ permite pasarea parametrilor prin valoare sau prin referință (&). Ce diferență crezi că produce asta?",
      conceptSections: [
        { label: "Prototip și definiție", text: "Dacă funcția e definită după main, trebuie declarată (prototip) înainte. Prototipul indică compilatorului semnătura fără corp." },
        { label: "By value vs by reference", text: "void f(int x) — copiază argumentul. void f(int& x) — operează pe originalul din memorie. & = mai eficient pentru obiecte mari, poate modifica argumentul." },
        { label: "Parametri cu valori default", text: "Spre deosebire de Java, C++ suportă nativ parametri cu valori default: int power(int base, int exp = 2)." },
      ],
      thinkQuestion: "Când ai folosi by reference în loc de by value? Ce se întâmplă dacă modifici un parametru by value?",
      steps: [
        { title: "Definești funcția", description: "tip_return numeFunc(tip param) { ... return valoare; }", codeHint: "std::string greet(std::string name)" },
        { title: "Valori default", description: "int power(int base, int exp = 2) — exp e opțional la apel.", codeHint: "power(3)    // exp=2 implicit\npower(3, 3) // exp=3 explicit" },
        { title: "By reference cu &", description: "void swap(int& a, int& b) — modifică originalele, nu copiile.", codeHint: "int temp = a; a = b; b = temp;" },
        { title: "Prototip dacă definiția e după main", description: "Declari semnătura înainte de main, definești după.", codeHint: "int factorial(int n); // prototip\nint main() { ... }\nint factorial(int n) { ... }" },
      ],
      recall: [
        { id: "f-cpp-1", question: "Ce face & în parametrul unei funcții C++?", options: ["Returnează adresa de memorie", "Pasează parametrul by reference (modifică originalul)", "Face parametrul opțional", "Inițializează la null"], correctIndex: 1, explanation: "void f(int& x) pasează x by reference. Modificările lui x în f afectează variabila originală din caller. Fără &, primești o copie și originalul nu se modifică." },
        { id: "f-cpp-2", question: "Dacă ai int power(int b, int exp = 2), cum apelezi cu exp = 3?", options: ["power(3, default=3)", "power(3)(3)", "power(3, 3)", "power(base=3, exp=3)"], correctIndex: 2, explanation: "C++ nu are keyword arguments. Furnizezi argumentele pozițional: power(3, 3) — primul e base, al doilea e exp (suprascrie default-ul 2)." },
      ],
      code: `#include <iostream>
#include <string>

// Prototipuri (dacă funcția e definită după main)
std::string greet(std::string name);
int power(int base, int exp = 2);
void swapVals(int& a, int& b);

int main() {
    std::cout << greet("Alice") << "\\n";  // Salut, Alice!
    std::cout << power(3) << "\\n";        // 9 (exp=2 default)
    std::cout << power(2, 10) << "\\n";   // 1024

    int x = 5, y = 10;
    swapVals(x, y);
    std::cout << x << " " << y << "\\n";  // 10 5

    return 0;
}

std::string greet(std::string name) {
    return "Salut, " + name + "!";
}

int power(int base, int exp) {
    int result = 1;
    for (int i = 0; i < exp; i++) result *= base;
    return result;
}

void swapVals(int& a, int& b) {
    // & = operăm pe originalele din caller
    int temp = a;
    a = b;
    b = temp;
}`,
    },
  },

  "arrays-lists": {
    conceptTitle: "Arrays și liste — colecții ordonate",
    python: {
      predict: "Ai o listă de 1000 de nume și vrei să verifici dacă 'Alice' e în ea. Câte comparații face Python în worst case?",
      conceptSections: [
        { label: "Lista Python", text: "Lista e o colecție ordonată, mutabilă, de tip mixt (poate conține int, str, liste). Echivalentul unui array dinamic cu resize automat." },
        { label: "Zero-indexed", text: "Primul element e la indexul 0. Ultimul e la indexul len-1 sau -1. Indecșii negativi numără de la capăt." },
        { label: "List comprehension", text: "[expresie for var in iterable if conditie] — sintaxa Pythonică pentru a crea liste concis. Preferabilă unui for + append." },
      ],
      thinkQuestion: "De ce list comprehension e preferată unui for + append în Python? Gândește-te la lizibilitate și performanță.",
      steps: [
        { title: "Creare și acces", description: "Listele se creează cu []. Accesezi cu index pozitiv sau negativ.", codeHint: "nums = [1, 2, 3]\nnums[0]  # 1\nnums[-1] # 3" },
        { title: "Modificare", description: "append() adaugă la final, insert() la index, remove() șterge prima apariție, pop() șterge ultimul.", codeHint: "lst.append(4)\nlst.insert(0, 0)\nlst.remove(2)" },
        { title: "Slicing", description: "lst[start:stop:step] — extragi subliste. Stop e exclusiv.", codeHint: "lst[1:4]    # de la 1 la 3\nlst[::-1]  # inversat" },
        { title: "List comprehension", description: "[f(x) for x in iterable if cond] — crea liste concis.", codeHint: "[x**2 for x in range(1, 6)]\n# [1, 4, 9, 16, 25]" },
      ],
      recall: [
        { id: "a-py-1", question: "Ce returnează [10, 20, 30, 40, 50][1:4]?", options: ["[10, 20, 30]", "[20, 30, 40]", "[20, 30, 40, 50]", "[10, 20, 30, 40]"], correctIndex: 1, explanation: "Slicing [1:4]: de la index 1 (inclusiv) la index 4 (exclusiv). Elementele 1, 2, 3 → [20, 30, 40]." },
        { id: "a-py-2", question: "Complexitatea verificării 'Alice' in lista_de_1000?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctIndex: 2, explanation: "Operatorul in pe o listă face căutare liniară — parcurge element cu element. O(n). Dacă ai nevoie de O(1), folosești un set sau dict." },
      ],
      code: `# Creare
fruits = ["banana", "mar", "cires", "para"]

# Acces
print(fruits[0])   # banana (primul)
print(fruits[-1])  # para (ultimul)
print(fruits[1:3]) # ['mar', 'cires'] — slicing

# Modificare
fruits.append("kiwi")         # adaugă la final
fruits.insert(0, "avocado")   # inserează la index 0
fruits.remove("mar")          # șterge prima apariție
last = fruits.pop()           # șterge și returnează ultimul

print(fruits) # ['avocado', 'banana', 'cires', 'para']

# List comprehension — pythonic
squares = [x**2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]

evens = [x for x in range(20) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Operații utile
nums = [3, 1, 4, 1, 5, 9, 2, 6]
print(sorted(nums))  # [1, 1, 2, 3, 4, 5, 6, 9] — copie sortată
nums.sort()          # sortare in-place
print(min(nums), max(nums), sum(nums))  # 1 9 31`,
    },
    javascript: {
      predict: "Care metodă JS crezi că modifică array-ul original: map sau filter? Gândește-te la comportamentul lor înainte să citești.",
      conceptSections: [
        { label: "Array dinamic mixt", text: "Array-urile JS pot conține tipuri mixte și se redimensionează automat. Accesul e zero-indexed." },
        { label: "Metode care MODIFICĂ originalul", text: "push, pop, shift, unshift, splice, sort, reverse — modifică array-ul pe loc." },
        { label: "Metode care returnează NOU", text: "map, filter, slice, concat, flat — returnează un array nou, originalul rămâne neatins." },
      ],
      thinkQuestion: "De ce e important să știi care metode modifică originalul și care nu? Ce bug poate apărea dacă nu știi?",
      steps: [
        { title: "Creare și acces", description: "Literale cu []. Ultimul element cu .at(-1) (modern).", codeHint: "const arr = [1, 2, 3];\narr.at(-1); // 3" },
        { title: "Metode care modifică originalul", description: "push/pop (final), shift/unshift (început), splice (orice poziție).", codeHint: "arr.push(4);\narr.splice(1, 1); // sterge 1 elem de la idx 1" },
        { title: "map / filter / reduce", description: "Funcționale — returnează array nou. Originalu rămâne neatins.", codeHint: "arr.map(x => x * 2)\narr.filter(x => x > 2)" },
        { title: "Spread și destructuring", description: "... pentru copiere/concatenare. Destructuring pentru extragere.", codeHint: "const [first, ...rest] = arr;\nconst copy = [...arr];" },
      ],
      recall: [
        { id: "a-js-1", question: "Care metodă NU modifică array-ul original?", options: ["push()", "sort()", "filter()", "splice()"], correctIndex: 2, explanation: "filter() returnează un array NOU cu elementele care trec de condiție. push, sort, splice modifică array-ul original (mutating methods)." },
        { id: "a-js-2", question: "Ce returnează [1,2,3].reduce((acc, n) => acc + n, 0)?", options: ["[1,2,3]", "6", "0", "undefined"], correctIndex: 1, explanation: "reduce parcurge array-ul acumulând o valoare. acc pornește de la 0. acc=0+1=1, acc=1+2=3, acc=3+3=6. Rezultat: 6." },
      ],
      code: `const fruits = ["banana", "mar", "cires", "para"];

// Acces
console.log(fruits[0]);    // banana
console.log(fruits.at(-1)); // para (modern API)

// Metode MUTATING (modifică originalul)
fruits.push("kiwi");              // adaugă la final
fruits.unshift("avocado");        // adaugă la început
fruits.splice(2, 1);              // sterge 1 element de la index 2

// Metode NON-MUTATING (returnează nou)
const sorted = [...fruits].sort(); // sortăm copia
const filtered = fruits.filter(f => f.length > 5);

console.log(fruits);   // original neatins
console.log(sorted);   // copie sortată

// Funcționale
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = numbers
  .filter(n => n % 2 === 0)  // [2, 4, 6, 8, 10]
  .map(n => n ** 2)           // [4, 16, 36, 64, 100]
  .reduce((sum, n) => sum + n, 0); // 220

console.log(result); // 220`,
    },
    java: {
      predict: "Care e diferența dintre int[] și ArrayList<Integer> în Java? Când ai folosi fiecare?",
      conceptSections: [
        { label: "Array fix vs ArrayList", text: "Array (int[]) are dimensiune fixă declarată la creare. ArrayList crește automat. Prefer ArrayList când dimensiunea e necunoscută." },
        { label: "Tipuri generice", text: "ArrayList<String>, ArrayList<Integer> — parametrizezi tipul elementelor. Integer (nu int) pentru ArrayList — Java boxed types." },
        { label: "Arrays utility class", text: "java.util.Arrays.sort(), .toString(), .copyOf() — metode statice utile pentru lucrul cu array-uri." },
      ],
      thinkQuestion: "De ce ArrayList nu acceptă tipuri primitive (int, double) ci doar boxed types (Integer, Double)?",
      steps: [
        { title: "Array cu dimensiune fixă", description: "int[] arr = new int[5]; sau int[] arr = {1,2,3};", codeHint: "int[] nums = {10, 20, 30};\nSystem.out.println(nums[0]); // 10" },
        { title: "ArrayList dinamic", description: "import java.util.ArrayList; ArrayList<Tip> list = new ArrayList<>();", codeHint: "ArrayList<String> list = new ArrayList<>();\nlist.add(\"Alice\");\nlist.get(0);" },
        { title: "Arrays.sort() și Arrays.toString()", description: "Metode statice din java.util.Arrays.", codeHint: "Arrays.sort(nums);\nSystem.out.println(Arrays.toString(nums));" },
        { title: "Stream API (Java 8+)", description: "Arrays.stream(arr).filter(...).map(...).collect(...)", codeHint: "int sum = Arrays.stream(nums).sum();" },
      ],
      recall: [
        { id: "a-java-1", question: "De ce ArrayList<int> e incorect în Java?", options: ["ArrayList nu suportă numere", "ArrayList acceptă doar tipuri referință, nu primitive", "int e keyword rezervat pentru arrays", "ArrayList e deprecated"], correctIndex: 1, explanation: "ArrayList (ca toate genericele Java) acceptă doar tipuri referință (Integer, Double, String). Pentru primitive, folosești Integer (boxed), care e automat convertit (autoboxing)." },
        { id: "a-java-2", question: "Ce face Arrays.sort(arr) pe un array int[]?", options: ["Returnează un array nou sortat", "Sortează array-ul pe loc (in-place)", "Returnează ArrayList sortat", "Aruncă excepție dacă nu e sortat"], correctIndex: 1, explanation: "Arrays.sort() sortează array-ul IN-PLACE (modifică originalul). Spre deosebire de sorted() din Python care returnează o copie." },
      ],
      code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

public class ArraysDemo {
    public static void main(String[] args) {
        // Array fix
        int[] nums = {5, 2, 8, 1, 9, 3};
        Arrays.sort(nums); // sortare in-place
        System.out.println(Arrays.toString(nums)); // [1, 2, 3, 5, 8, 9]

        // ArrayList dinamic
        ArrayList<String> fruits = new ArrayList<>();
        fruits.add("banana");
        fruits.add("mar");
        fruits.add("cires");
        fruits.remove("mar");           // șterge după valoare
        fruits.remove(0);               // șterge după index
        Collections.sort(fruits);

        for (String fruit : fruits) {
            System.out.println(fruit);
        }

        // Stream API (Java 8+)
        int sum = Arrays.stream(nums).sum();
        int max = Arrays.stream(nums).max().getAsInt();
        System.out.printf("Sum: %d, Max: %d%n", sum, max);

        // Verificare membership
        System.out.println(fruits.contains("cires")); // true
    }
}`,
    },
    cpp: {
      predict: "C++ are array-uri C-style și std::vector. Care crezi că e mai sigur și recomandat în C++ modern?",
      conceptSections: [
        { label: "Array C-style vs std::vector", text: "int arr[5] — dimensiune fixă la compile time, fără bounds checking. std::vector<int> — dinamic, safe, cu metode. Preferă vector în C++ modern." },
        { label: "std::vector", text: "push_back() adaugă la final. size() returnează numărul de elemente. Iterabil cu range-based for." },
        { label: "Algoritmi STL", text: "std::sort, std::find, std::count din <algorithm>. std::accumulate din <numeric>. Nu reinventa roata." },
      ],
      thinkQuestion: "De ce array-ul C-style nu are bounds checking? Ce bug periculos poate apărea din asta?",
      steps: [
        { title: "std::vector — recomandat", description: "vector<int> v = {1,2,3}; sau vector<int> v(5, 0); (5 zerouri).", codeHint: "std::vector<int> v = {1, 2, 3};\nv.push_back(4);" },
        { title: "Acces și iterare", description: "v[i] sau v.at(i) (cu bounds check). Range-based for pentru iterare simplă.", codeHint: "for (const auto& x : v)\n    std::cout << x;" },
        { title: "std::sort", description: "std::sort(v.begin(), v.end()) — sortare in-place.", codeHint: "std::sort(v.begin(), v.end());" },
        { title: "std::find și std::accumulate", description: "find returnează iterator. accumulate sumează.", codeHint: "auto it = std::find(v.begin(), v.end(), 3);\nif (it != v.end()) { /* găsit */ }" },
      ],
      recall: [
        { id: "a-cpp-1", question: "Ce returnează v.end() pentru un vector?", options: ["Ultimul element", "Iterator past-the-end (după ultimul element)", "nullptr", "Dimensiunea vectorului"], correctIndex: 1, explanation: "v.end() returnează un iterator care indică DUPĂ ultimul element — nu ultimul element în sine (acela ar fi v.back() sau *(v.end()-1)). Intervalele STL sunt [begin, end)." },
        { id: "a-cpp-2", question: "Diferența dintre v[i] și v.at(i)?", options: ["Nu există diferență", "at() e mai rapidă", "at() aruncă std::out_of_range dacă i e invalid; [] nu verifică", "[] e pentru arrays, at() pentru vector"], correctIndex: 2, explanation: "v.at(i) face bounds checking și aruncă out_of_range dacă i >= v.size(). v[i] nu verifică — acces invalid e undefined behavior." },
      ],
      code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    // Sortare in-place
    std::sort(nums.begin(), nums.end());

    // Afișare cu range-based for
    for (const auto& n : nums) {
        std::cout << n << " ";
    }
    std::cout << "\\n"; // 1 2 3 5 8 9

    // Adăugare / ștergere
    nums.push_back(10);
    nums.erase(nums.begin()); // sterge primul

    // Căutare
    auto it = std::find(nums.begin(), nums.end(), 8);
    if (it != nums.end()) {
        std::cout << "Gasit la index: "
                  << (it - nums.begin()) << "\\n";
    }

    // Suma cu accumulate
    int sum = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "Sum: " << sum << "\\n";

    // Verificare membership cu std::count
    int cnt = std::count(nums.begin(), nums.end(), 5);
    std::cout << "5 apare de " << cnt << " ori\\n";

    return 0;
}`,
    },
  },

  "strings": {
    conceptTitle: "String-uri — text ca date",
    python: {
      predict: "Dacă s = 'Hello', ce returnează s[::-1]? Gândește-te la slicing cu step negativ.",
      conceptSections: [
        { label: "Imuabilitate", text: "String-urile Python sunt imuabile — nu poți modifica un caracter in-place. Orice 'modificare' creează un string nou." },
        { label: "Indexare și slicing", text: "Funcționează exact ca la liste: s[0], s[-1], s[1:4], s[::2], s[::-1] (inversare)." },
        { label: "F-strings (Python 3.6+)", text: "f\"{variabila:.2f}\" — cel mai modern și rapid mod de formatare. Suportă expresii complete: f\"{2+2}\"." },
      ],
      thinkQuestion: "De ce string-urile sunt imuabile în Python? Ce avantaje produce asta pentru securitate și performanță?",
      steps: [
        { title: "Acces și slicing", description: "s[0] primul caracter. s[-1] ultimul. s[1:4] caractere de la index 1 la 3.", codeHint: "s = 'Hello'\ns[0]    # 'H'\ns[::-1] # 'olleH'" },
        { title: "Metode comune", description: ".upper(), .lower(), .strip(), .replace(), .split(), .join()", codeHint: "s.upper()            # 'HELLO'\n'a b'.split()        # ['a', 'b']\n', '.join(['a','b']) # 'a, b'" },
        { title: "Verificare conținut", description: ".startswith(), .endswith(), .in operator, .count()", codeHint: "'ll' in s       # True\ns.count('l')    # 2" },
        { title: "F-string formatare", description: "f\"{val:.2f}\" pentru float cu 2 zecimale. f\"{val:>10}\" pentru aliniere dreapta.", codeHint: "f\"{score:.1f}%\" # '98.5%'" },
      ],
      recall: [
        { id: "s-py-1", question: "Ce returnează 'Hello'[::-1]?", options: ["'Hello'", "'H'", "'olleH'", "Eroare — string-urile nu suportă step negativ"], correctIndex: 2, explanation: "[::-1] face slicing cu step -1 — parcurge de la dreapta la stânga, inversând string-ul. 'Hello' → 'olleH'." },
        { id: "s-py-2", question: "Ce returnează ' hello '.strip()?", options: ["'hello '", "' hello'", "'hello'", "' hello '"], correctIndex: 2, explanation: ".strip() elimină spațiile albe de la AMBELE capete. .lstrip() elimină doar din stânga, .rstrip() doar din dreapta." },
      ],
      code: `text = "  Hello, World!  "

# Curățare
clean = text.strip().lower()
print(clean)  # "hello, world!"

# Verificări
print(clean.startswith("hello"))  # True
print("world" in clean)           # True
print(clean.count("l"))           # 3

# Transformări
words = clean.split(", ")   # ['hello', 'world!']
upper = [w.upper() for w in words]
print(", ".join(upper))     # HELLO, WORLD!

# F-string cu formatare
name, score = "Alice", 98.5
print(f"Student: {name:>10} | Scor: {score:.1f}%")
# Student:      Alice | Scor: 98.5%

# Palindrom checker
def is_palindrome(s: str) -> bool:
    s = s.lower().replace(" ", "")
    return s == s[::-1]

print(is_palindrome("racecar"))  # True
print(is_palindrome("hello"))    # False`,
    },
    javascript: {
      predict: "JS are template literals (backtick). De ce sunt preferate față de concatenarea cu +?",
      conceptSections: [
        { label: "Imuabilitate", text: "Ca Python, metodele string returnează string-uri noi. Originalul nu se modifică." },
        { label: "Template literals", text: "Backtick `` ` `` permite multi-line și ${expresie} pentru interpolări. Pot conține orice expresie JS." },
        { label: "Regex în JS", text: "JS are suport nativ cu /pattern/flags. .match(), .replace(), .test() — pentru căutare și înlocuire avansată." },
      ],
      thinkQuestion: "Ce avantaj are .replaceAll() față de .replace() cu regex? Când ai folosi regex în loc de metode simple?",
      steps: [
        { title: "Acces și proprietăți", description: "s[0] sau s.charAt(0). s.length pentru lungime. s.at(-1) pentru ultimul.", codeHint: "const s = 'Hello';\ns.at(-1); // 'o'" },
        { title: "Metode de transformare", description: ".toUpperCase(), .toLowerCase(), .trim(), .replace(), .replaceAll()", codeHint: "s.replace('l', 'r')    // prima apariție\ns.replaceAll('l', 'r') // toate" },
        { title: "Verificare conținut", description: ".startsWith(), .endsWith(), .includes(), .indexOf()", codeHint: "s.includes('ell')  // true\ns.indexOf('l')     // 2" },
        { title: "Split și template literals", description: ".split() returnează array. Template literals suportă expresii.", codeHint: "s.split('')         // ['H','e','l','l','o']\n`Sum: ${1+2+3}`     // 'Sum: 6'" },
      ],
      recall: [
        { id: "s-js-1", question: "Ce diferență e între .replace() și .replaceAll()?", options: ["Nu există diferență", ".replace înlocuiește prima apariție; .replaceAll înlocuiește toate", ".replaceAll e mai lentă", ".replace e deprecated"], correctIndex: 1, explanation: ".replace('l', 'r') înlocuiește PRIMA apariție. .replaceAll('l', 'r') înlocuiește TOATE aparițiile. Cu regex global /l/g, .replace înlocuiește și ea toate aparițiile." },
        { id: "s-js-2", question: "Ce returnează 'hello'.split('')?", options: ["['hello']", "['h','e','l','l','o']", "['h', 'ello']", "5"], correctIndex: 1, explanation: "split('') cu string gol ca separator împarte în caractere individuale. split(' ') ar împărți după spații. split() fără argument returnează ['hello']." },
      ],
      code: `const text = "  Hello, World!  ";

// Curățare
const clean = text.trim().toLowerCase();
console.log(clean); // "hello, world!"

// Verificări
console.log(clean.startsWith("hello")); // true
console.log(clean.includes("world"));   // true
console.log(clean.indexOf("o"));        // 4

// Transformări
const words = clean.split(", ");   // ['hello', 'world!']
const upper = words.map(w => w.toUpperCase());
console.log(upper.join(" | "));    // HELLO | WORLD!

// Template literals cu expresii
const name = "Alice", score = 98.5;
console.log(\`Student: \${name.padStart(10)} | Scor: \${score.toFixed(1)}%\`);

// Regex
const noVowels = clean.replace(/[aeiou]/g, "*");
console.log(noVowels); // "h*ll*, w*rld!"

// Palindrom
const isPalindrome = s =>
  s.toLowerCase().replace(/\\s/g, "") ===
  [...s.toLowerCase().replace(/\\s/g, "")].reverse().join("");

console.log(isPalindrome("racecar")); // true`,
    },
    java: {
      predict: "De ce în Java folosim .equals() pentru compararea string-urilor și nu ==? Ce diferență e?",
      conceptSections: [
        { label: "Imuabilitate", text: "String în Java e imutable — orice modificare creează un obiect nou. Eficient pentru sharing în string pool." },
        { label: ".equals() vs ==", text: "== compară referințele (adrese). .equals() compară conținutul. ÎNTOTDEAUNA .equals() pentru conținut!" },
        { label: "StringBuilder", text: "Pentru concatenări repetate (în bucle) folosești StringBuilder. String + String în buclă e O(n²) — StringBuilder e O(n)." },
      ],
      thinkQuestion: "De ce concatenarea String în buclă (s += 'x') e O(n²) în Java? Cum ajunge StringBuilder la O(n)?",
      steps: [
        { title: "Acces și proprietăți", description: ".charAt(i), .length(), .substring(start, end)", codeHint: "String s = \"Hello\";\nchar c = s.charAt(0); // 'H'\nint len = s.length(); // 5" },
        { title: "Metode de transformare", description: ".toUpperCase(), .toLowerCase(), .trim(), .replace()", codeHint: "s.trim().toLowerCase()\ns.replace(\"World\", \"Java\")" },
        { title: "Comparare cu .equals()", description: "NICIODATĂ == pentru conținut. .equalsIgnoreCase() pentru caz-insensitiv.", codeHint: "s.equals(\"Hello\")           // true\ns.equalsIgnoreCase(\"hello\") // true" },
        { title: "StringBuilder pentru concatenare eficientă", description: "sb.append(), sb.toString() — eficient pentru concatenări în bucle.", codeHint: "StringBuilder sb = new StringBuilder();\nsb.append(\"Hello\");\nsb.toString();" },
      ],
      recall: [
        { id: "s-java-1", question: "Ce returnează String s1 = \"Hello\"; String s2 = \"Hello\"; s1 == s2?", options: ["Întotdeauna false", "Întotdeauna true", "Depinde — poate fi true datorită string pool", "Eroare de compilare"], correctIndex: 2, explanation: "Java are un string pool: literalele identice pot referi același obiect → == true. Dar nu e garantat (new String('Hello') creează obiecte separate). De aceea .equals() e obligatoriu — funcționează corect indiferent." },
        { id: "s-java-2", question: "De ce StringBuilder e mai eficient decât String + în bucle?", options: ["StringBuilder e native code", "String e deprecated", "Fiecare String += creează un obiect nou; StringBuilder modifică intern", "Nu există diferență reală"], correctIndex: 2, explanation: "str += 'x' creează un String NOU la fiecare iterație (O(n) copieri × n iterații = O(n²)). StringBuilder menține un buffer intern pe care îl extinde → O(n) total." },
      ],
      code: `public class StringsDemo {
    public static void main(String[] args) {
        String text = "  Hello, World!  ";

        // Curățare
        String clean = text.trim().toLowerCase();
        System.out.println(clean); // "hello, world!"

        // Verificări
        System.out.println(clean.startsWith("hello")); // true
        System.out.println(clean.contains("world"));   // true
        System.out.println(clean.indexOf('o'));         // 4

        // Comparare — ÎNTOTDEAUNA .equals()
        String s1 = "hello";
        String s2 = new String("hello");
        System.out.println(s1 == s2);          // false (ref diferite)
        System.out.println(s1.equals(s2));     // true (conținut egal)

        // StringBuilder pentru concatenare eficientă
        StringBuilder sb = new StringBuilder();
        String[] words = clean.split(", ");
        for (String w : words) {
            sb.append(w.toUpperCase()).append(" | ");
        }
        System.out.println(sb.toString()); // HELLO, | WORLD! |

        // Palindrom
        String test = "racecar";
        String reversed = new StringBuilder(test).reverse().toString();
        System.out.println(test.equals(reversed)); // true
    }
}`,
    },
    cpp: {
      predict: "C++ are std::string și char* (C-style). Care e mai sigur? De ce mai există char* dacă std::string e mai bun?",
      conceptSections: [
        { label: "std::string vs char*", text: "std::string e mutabilă, safe, cu metode bogate. char* e pointerul la array de caractere — stil C, fără bounds checking, unsafe. Preferă std::string." },
        { label: "Mutabilitate", text: "Spre deosebire de Python/Java, std::string e mutabilă în C++ — poți modifica caractere direct: s[0] = 'h'." },
        { label: "Conversii", text: "std::to_string(42) → \"42\". std::stoi(\"42\") → 42. std::stod(\"3.14\") → 3.14." },
      ],
      thinkQuestion: "De ce std::string e mutabilă în C++ când Python/Java fac string-urile imuabile? Ce avantaje și dezavantaje produce asta?",
      steps: [
        { title: "Creare și acces", description: "std::string s = \"Hello\"; s[0] (fără bounds check) sau s.at(0) (cu check).", codeHint: "std::string s = \"Hello\";\ns[0] = 'h'; // mutabil!\ns.size();   // 5" },
        { title: "Metode comune", description: ".substr(), .find(), .replace(), .append(), .empty()", codeHint: "s.substr(1, 3)       // \"ell\"\ns.find(\"ll\")         // 2\ns.replace(0, 1, \"J\") // \"Jello\"" },
        { title: "Concatenare cu + și +=", description: "s += \" World\"; sau s.append(\" World\");", codeHint: "std::string result = \"Hello\" + std::string(\", \") + \"World\";" },
        { title: "Conversii numerice", description: "std::to_string() și std::stoi/stof/stod.", codeHint: "std::to_string(42)   // \"42\"\nstd::stoi(\"42\")      // 42" },
      ],
      recall: [
        { id: "s-cpp-1", question: "Care e diferența dintre s[0] și s.at(0) în std::string?", options: ["s[0] e mai lentă", "s.at(0) aruncă out_of_range la acces invalid; s[0] nu verifică", "Nu există diferență", "s.at() funcționează doar cu char*"], correctIndex: 1, explanation: "s.at(i) face bounds checking și aruncă std::out_of_range dacă i >= s.size(). s[i] nu verifică — acces invalid e undefined behavior (crash sau date corupte)." },
        { id: "s-cpp-2", question: "Ce returnează std::stoi(\"42abc\")?", options: ["Eroare de compilare", "42 (parsează cât poate)", "0", "Aruncă exception"], correctIndex: 1, explanation: "std::stoi parsează numărul de la început și se oprește la primul caracter non-numeric. '42abc' → 42. Dacă nu găsește niciun număr, aruncă std::invalid_argument." },
      ],
      code: `#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>

int main() {
    std::string text = "  Hello, World!  ";

    // Trim manual (C++ nu are .trim() built-in)
    auto start = text.find_first_not_of(" \\t\\n\\r");
    auto end   = text.find_last_not_of(" \\t\\n\\r");
    std::string clean = (start == std::string::npos)
                        ? "" : text.substr(start, end - start + 1);

    // toLower
    std::transform(clean.begin(), clean.end(), clean.begin(), ::tolower);
    std::cout << clean << "\\n"; // "hello, world!"

    // find și replace
    size_t pos = clean.find("world");
    if (pos != std::string::npos) {
        clean.replace(pos, 5, "c++");
    }
    std::cout << clean << "\\n"; // "hello, c++!"

    // Mutabilitate — caracterele se pot modifica direct
    clean[0] = 'H';
    std::cout << clean << "\\n"; // "Hello, c++!"

    // Conversii
    int n = std::stoi("42");
    std::string ns = std::to_string(n * 2);
    std::cout << ns << "\\n"; // "84"

    // Palindrom
    std::string s = "racecar";
    std::string rev(s.rbegin(), s.rend()); // reverse iterator
    std::cout << (s == rev ? "palindrom" : "nu") << "\\n"; // palindrom

    return 0;
}`,
    },
  },
};

// ── Main update ────────────────────────────────────────────────────────────────

async function main() {
  const [mod] = await query("modules?slug=eq.programming-basics&select=id");
  if (!mod) throw new Error("Module programming-basics not found");
  console.log(`Module: ${mod.id}`);

  const lessons = await query(
    `lessons?module_id=eq.${mod.id}&select=id,slug,language&order=position`
  );
  console.log(`Found ${lessons.length} lessons\n`);

  let updated = 0, skipped = 0;

  for (const lesson of lessons) {
    const lang = lesson.language;
    // Strip "-{lang}" suffix to get topic slug
    const topicSlug = lesson.slug.replace(`-${lang}`, "");

    const topicData = TOPICS[topicSlug];
    if (!topicData || !topicData[lang]) {
      console.log(`  SKIP ${lesson.slug} — no content defined`);
      skipped++;
      continue;
    }

    const content = makeLesson(topicSlug, lang);

    const blocks = await query(
      `lesson_blocks?lesson_id=eq.${lesson.id}&type=eq.content&select=id&limit=1`
    );
    if (!blocks.length) {
      console.log(`  SKIP ${lesson.slug} — no content block`);
      skipped++;
      continue;
    }

    await query(`lesson_blocks?id=eq.${blocks[0].id}`, {
      method: "PATCH",
      body: JSON.stringify({ data: { content } }),
    });

    console.log(`  ✓ ${lesson.slug} — predict + concept + think + code + recall`);
    updated++;
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

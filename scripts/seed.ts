/**
 * Seed script — populates the DB end-to-end via the HTTP API.
 * Run: npx tsx scripts/seed.ts
 * Idempotent: skips creation when a record with the same slug already exists.
 */

const BASE = "http://localhost:3000/api";
const SUPABASE_URL = "https://ypdfaegmuxxxiamhswgk.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZGZhZWdtdXh4eGlhbWhzd2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQzMjYyMywiZXhwIjoyMDkwMDA4NjIzfQ.6v-24nO6Pi3NP39ZDPxY7p9BIcwlkC236zvGo2n8H7s";

const SEED_EMAIL = "seed@admin.com";
const SEED_PASS = "Seed1234!";

// ── helpers ──────────────────────────────────────────────────────────────────

async function post(path: string, body: unknown, cookie?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cookie) headers["Cookie"] = cookie;

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
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

async function supabasePatch(table: string, filter: string, body: unknown) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Supabase PATCH ${table}: ${JSON.stringify(json)}`);
  return json;
}

async function supabaseGet(path: string): Promise<Array<Record<string, string>>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase GET ${path}: ${res.status}`);
  return res.json() as Promise<Array<Record<string, string>>>;
}

/** Returns existing id if slug already in DB, otherwise creates via API and returns new id. */
async function upsertSubject(
  body: { name: string; description: string; position: number },
  slug: string,
): Promise<string> {
  const existing = await supabaseGet(`subjects?slug=eq.${slug}&select=id`);
  if (existing.length > 0) {
    console.log(`  ~ ${body.name} already exists (${existing[0]!.id})`);
    return existing[0]!.id;
  }
  const res = await post("/subjects", body) as { id?: string };
  const id = res.id!;
  console.log(`  ✓ ${body.name} (${id})`);
  return id;
}

async function upsertCategory(
  body: { name: string; subjectId: string; position: number },
  slug: string,
  subjectId: string,
): Promise<string> {
  const encodedName = encodeURIComponent(body.name);
  const existing = await supabaseGet(
    `categories?name=eq.${encodedName}&subject_id=eq.${subjectId}&select=id`,
  );
  if (existing.length > 0) {
    console.log(`  ~ ${body.name} already exists (${existing[0]!.id})`);
    return existing[0]!.id;
  }
  await post("/categories", body);
  const rows = await supabaseGet(
    `categories?name=eq.${encodedName}&subject_id=eq.${subjectId}&select=id`,
  );
  const id = rows[0]!.id;
  console.log(`  ✓ ${body.name} (${id})`);
  return id;
}

async function upsertModule(
  body: { name: string; slug: string; position: number; categoryId: string },
): Promise<string> {
  const existing = await supabaseGet(`modules?slug=eq.${body.slug}&select=id`);
  if (existing.length > 0) {
    console.log(`  ~ ${body.name} already exists (${existing[0]!.id})`);
    return existing[0]!.id;
  }
  await post("/modules", body);
  const rows = await supabaseGet(`modules?slug=eq.${body.slug}&select=id`);
  const id = rows[0]!.id;
  console.log(`  ✓ ${body.name} (${id})`);
  return id;
}

function ok(label: string, id?: string) {
  console.log(`  ✓ ${label}${id ? ` (${id})` : ""}`);
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── 1. Auth ────────────────────────────────────────────────────────────────
  console.log("\n── Auth ─────────────────────────────────────────────────");

  await post("/auth/register", { email: SEED_EMAIL, password: SEED_PASS })
    .catch(() => console.log("  ~ User already registered"));
  ok("Seed user ready");

  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: SEED_EMAIL, password: SEED_PASS }),
  });
  const loginJson = (await loginRes.json()) as {
    data?: { accessToken?: string };
  };
  const rawCookies = loginRes.headers.getSetCookie?.() ?? [];
  // Extract only the name=value part from each Set-Cookie header
  const cookieHeader = rawCookies.map((c) => c.split(";")[0]).join("; ");

  const token = loginJson.data?.accessToken ?? "";
  const payload = JSON.parse(Buffer.from(token.split(".")[1]!, "base64").toString());
  const userId: string = payload.sub;
  ok("Logged in", userId);

  await supabasePatch("profiles", `id=eq.${userId}`, { role: "admin" });
  ok("Role → admin");

  // ── 2. Subject ────────────────────────────────────────────────────────────
  console.log("\n── Subject ──────────────────────────────────────────────");

  const subjectId = await upsertSubject(
    {
      name: "Computer Science",
      description:
        "Algoritmi, structuri de date, matematică discretă și tehnici de rezolvare a problemelor.",
      position: 1,
    },
    "computer-science",
  );

  // ── 3. Categories ─────────────────────────────────────────────────────────
  console.log("\n── Categories ───────────────────────────────────────────");

  const catAlgId = await upsertCategory(
    { name: "Algorithms", subjectId, position: 1 },
    "algorithms",
    subjectId,
  );
  const catDsId = await upsertCategory(
    { name: "Data Structures", subjectId, position: 2 },
    "data-structures",
    subjectId,
  );

  // ── 4. Modules ────────────────────────────────────────────────────────────
  console.log("\n── Modules (Algorithms) ─────────────────────────────────");

  const algorithmModules = [
    { name: "Sorting Algorithms",   slug: "sorting-algorithms",   position: 1 },
    { name: "Searching Algorithms", slug: "searching-algorithms", position: 2 },
    { name: "Dynamic Programming",  slug: "dynamic-programming",  position: 3 },
    { name: "Greedy Algorithms",    slug: "greedy-algorithms",    position: 4 },
    { name: "Graph Algorithms",     slug: "graph-algorithms",     position: 5 },
  ];

  const sortingModuleId = await upsertModule({
    ...algorithmModules[0]!,
    categoryId: catAlgId,
  });
  for (const mod of algorithmModules.slice(1)) {
    await upsertModule({ ...mod, categoryId: catAlgId });
  }

  console.log("\n── Modules (Data Structures) ────────────────────────────");

  const dsModules = [
    { name: "Arrays & Strings", slug: "arrays-strings", position: 1 },
    { name: "Linked Lists",     slug: "linked-lists",   position: 2 },
    { name: "Stacks & Queues",  slug: "stacks-queues",  position: 3 },
    { name: "Trees",            slug: "trees",           position: 4 },
    { name: "Hash Tables",      slug: "hash-tables",     position: 5 },
    { name: "Graphs",           slug: "graphs",          position: 6 },
  ];
  for (const mod of dsModules) {
    await upsertModule({ ...mod, categoryId: catDsId });
  }

  // ── 5. Lesson ─────────────────────────────────────────────────────────────
  console.log("\n── Lesson ───────────────────────────────────────────────");

  const existingLesson = await supabaseGet(
    `lessons?module_id=eq.${sortingModuleId}&slug=eq.bubble-sort-de-la-teorie-la-practic&select=id`,
  );
  let lessonId: string;
  if (existingLesson.length > 0) {
    lessonId = existingLesson[0]!.id;
    console.log(`  ~ Bubble Sort lesson already exists (${lessonId})`);
  } else {
    const lessonRes = await post(
      "/lessons",
      {
        moduleId: sortingModuleId,
        title: "Bubble Sort — de la teorie la practică",
        description:
          "Înțelege algoritmul Bubble Sort pas cu pas: complexitate O(n²), varianta optimizată cu flag și vizualizare interactivă.",
        durationSeconds: 1200,
        position: 1,
        isActive: true,
      },
      cookieHeader,
    ) as { data?: { id?: string } };
    lessonId = lessonRes.data?.id!;
    ok("Bubble Sort lesson", lessonId);
  }

  // ── 6. Lesson Blocks ──────────────────────────────────────────────────────
  console.log("\n── Lesson Blocks ────────────────────────────────────────");

  const existingBlocks = await supabaseGet(
    `lesson_blocks?lesson_id=eq.${lessonId}&select=id,type,engine&order=position`,
  );

  let block1Id: string, block2Id: string, block3Id: string, block4Id: string;

  if (existingBlocks.length >= 4) {
    [block1Id, block2Id, block3Id, block4Id] = existingBlocks.map((b) => b.id);
    console.log(`  ~ All 4 blocks already exist`);
  } else {
    const b1 = await post("/lessons-block", {
      lessonId,
      type: "content",
      data: {
        content: [
          { nodeType: "heading", level: 2, text: "Ce este Bubble Sort?" },
          {
            nodeType: "paragraph",
            text: "Bubble Sort este unul dintre cei mai simpli algoritmi de sortare. Parcurge lista în mod repetat, compară elementele adiacente și le interschimbă dacă sunt în ordinea greșită.",
          },
          {
            nodeType: "paragraph",
            text: "Complexitate timp: O(n²) în cazul mediu și în cel mai rău caz. Complexitate spațiu: O(1) — sortare in-place.",
          },
          {
            nodeType: "code",
            language: "python",
            code: "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr",
          },
        ],
      },
    }) as { createdLessonBlock?: { id?: string } };
    block1Id = b1.createdLessonBlock?.id!;
    ok("Block 1 — content (teorie)", block1Id);

    const b2 = await post("/lessons-block", {
      lessonId,
      type: "interactive",
      engine: "algorithm:bubble-sort",
      data: { initialArray: [64, 34, 25, 12, 22, 11, 90] },
    }) as { createdLessonBlock?: { id?: string } };
    block2Id = b2.createdLessonBlock?.id!;
    ok("Block 2 — interactive (bubble-sort visualizer)", block2Id);

    const b3 = await post("/lessons-block", {
      lessonId,
      type: "assessment",
      engine: "quiz:mcq",
      data: {
        question: "Care este complexitatea timp a Bubble Sort în cel mai rău caz?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctIndex: 2,
      },
    }) as { createdLessonBlock?: { id?: string } };
    block3Id = b3.createdLessonBlock?.id!;
    ok("Block 3 — assessment (quiz:mcq)", block3Id);

    const b4 = await post("/lessons-block", {
      lessonId,
      type: "assessment",
      engine: "quiz:input",
      data: {
        question: "Câte comparații face Bubble Sort pe un array de 5 elemente în cel mai rău caz?",
        correctAnswer: 10,
      },
    }) as { createdLessonBlock?: { id?: string } };
    block4Id = b4.createdLessonBlock?.id!;
    ok("Block 4 — assessment (quiz:input)", block4Id);
  }

  // ── 7. Lesson Activities ──────────────────────────────────────────────────
  console.log("\n── Lesson Activities ────────────────────────────────────");

  const existingActivities = await supabaseGet(
    `lesson_activities?lesson_id=eq.${lessonId}&select=id`,
  );

  if (existingActivities.length >= 4) {
    console.log(`  ~ All 4 activities already exist`);
  } else {
    await post("/lesson-activities", {
      lessonId,
      lessonBlockId: block1Id!,
      type: "content",
      title: "Citește teoria Bubble Sort",
      weight: 0.2,
      required: true,
    });
    ok("Activity 1 — content read");

    await post("/lesson-activities", {
      lessonId,
      lessonBlockId: block2Id!,
      type: "exercise",
      title: "Vizualizează pașii Bubble Sort",
      weight: 0.3,
      required: true,
    });
    ok("Activity 2 — interactive exercise");

    await post("/lesson-activities", {
      lessonId,
      lessonBlockId: block3Id!,
      type: "quiz",
      title: "Quiz: complexitate Bubble Sort",
      weight: 0.3,
      required: true,
    });
    ok("Activity 3 — quiz MCQ");

    await post("/lesson-activities", {
      lessonId,
      lessonBlockId: block4Id!,
      type: "quiz",
      title: "Calculează numărul de comparații",
      weight: 0.2,
      required: false,
    });
    ok("Activity 4 — quiz input");
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n── Seed complete! ───────────────────────────────────────");
  console.log(`
  Subject  : Computer Science
  ├─ Category: Algorithms
  │   ├─ Sorting Algorithms   → Lesson "Bubble Sort — de la teorie la practică"
  │   │     ├─ Block 1: content (teorie + cod Python)
  │   │     ├─ Block 2: interactive (bubble-sort visualizer)
  │   │     ├─ Block 3: assessment quiz:mcq
  │   │     └─ Block 4: assessment quiz:input
  │   ├─ Searching Algorithms
  │   ├─ Dynamic Programming
  │   ├─ Greedy Algorithms
  │   └─ Graph Algorithms
  └─ Category: Data Structures
      ├─ Arrays & Strings
      ├─ Linked Lists
      ├─ Stacks & Queues
      ├─ Trees
      ├─ Hash Tables
      └─ Graphs
  `);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message);
  process.exit(1);
});

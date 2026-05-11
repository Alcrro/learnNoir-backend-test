---
name: Seed data structure for Computer Science subject
description: What data exists in the DB and how to re-run seed
type: project
---

Seed script at `scripts/seed.ts`. Run with `npx tsx scripts/seed.ts`. Idempotent — safe to re-run.

**Current DB content (as of 2026-05-03):**
- Subject: Computer Science (id: fe520705-6302-42d3-9aac-fd6019f88e0c, slug: computer-science)
- Category Algorithms (id: 612fbb40-a7d6-4c63-a386-bbd82a5a2e5d) with 5 modules: Sorting, Searching, Dynamic Programming, Greedy, Graph Algorithms
- Category Data Structures (id: d79548b7-b950-4699-aeba-ff7b0317ad2d) with 6 modules: Arrays & Strings, Linked Lists, Stacks & Queues, Trees, Hash Tables, Graphs
- Lesson "Bubble Sort — de la teorie la practică" (id: 5a1bba26-7c61-48a1-958b-133a64e4a1d6) under Sorting Algorithms with 4 blocks and 4 activities
- Seed admin user: seed@admin.com (id: dcd5da0c-e04b-41d4-9e20-c44f8a36c92e, role: admin)

**Why:** Needed to populate initial data to test the full frontend→backend flow.

**How to apply:** When user asks about existing data, refer to these IDs. When adding more seed data, extend scripts/seed.ts rather than creating new scripts.

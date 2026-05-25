/**
 * PLAN DE IMPLEMENTARE — Lesson Layout Builder: Backend
 * Feature doc complet: docs/features/feature-lesson-layout-builder.md
 *
 * Stack: Express 5 + TypeScript + Supabase
 * Arhitectură: Clean Architecture — domain / application / infrastructure / interfaces
 * Referință pattern: backend/src/features/lessons-block/
 *
 * CONTEXT:
 * Endpointurile backend EXISTĂ DEJA și nu necesită modificări:
 *   POST  /lessons-block                — creare bloc nou (prima salvare)
 *   PATCH /lessons-block/:id/content    — actualizare content (modificări ulterioare)
 *
 * DTO-ul existent acceptă orice structură JSON în câmpul data.content
 * (z.array(z.record(z.string(), z.unknown()))) — nu e necesară modificarea validării Zod.
 *
 * Singura muncă backend este extinderea shared types cu tipurile noi de noduri
 * introduse de builder (10 tipuri noi față de ce există acum în lesson-content.ts).
 *
 * DEPENDENCY ORDER:
 *   STEP 1 → Shared types — extindere LessonContentNode cu tipuri noi
 *   STEP 2 → Re-export din shared/src/index.ts
 *   STEP 3 → Verificare TypeScript (noEmit) — zero erori noi
 */

// =============================================================================
// STEP 1 — SHARED TYPES: EXTINDERE LessonContentNode
// =============================================================================
// FILES:   shared/src/lesson-content.ts
//
// CONTEXT:
// Tipurile existente în LessonContentNode: concept, steps, example, complexity,
// formula, proof, theorem + fallback { type: string; [key: string]: unknown }
//
// Tipuri noi introduse de builder (din NODE_DEFAULTS din feature doc):
//   heading, paragraph, code, predict, think, recall,
//   inline-quiz, code-runner, drag-sort, fill-blanks
//
// PROMPT:
// """
// Extinde shared/src/lesson-content.ts cu 10 tipuri noi de noduri și adaugă-le
// în union-ul LessonContentNode. Păstrează fallback-ul { type: string; [key: string]: unknown }
// la final pentru compatibilitate.
//
// Tipuri noi de adăugat:
//
//   export type HeadingBlock = {
//     type: "heading";
//     text: string;
//     level: 1 | 2 | 3 | 4;
//   };
//
//   export type ParagraphBlock = {
//     type: "paragraph";
//     text: string;
//   };
//
//   export type CodeBlock = {
//     type: "code";
//     code: string;
//     language: string;
//   };
//
//   export type PredictBlock = {
//     type: "predict";
//     question: string;
//     answer: string;
//   };
//
//   export type ThinkBlock = {
//     type: "think";
//     question: string;
//     reveal: string;
//   };
//
//   export type RecallQuestion = {
//     question: string;
//     options: string[];
//     correct: number;
//   };
//
//   export type RecallBlock = {
//     type: "recall";
//     questions: RecallQuestion[];
//   };
//
//   export type InlineQuizBlock = {
//     type: "inline-quiz";
//     question: string;
//     options: string[];
//     correct: number;
//   };
//
//   export type CodeRunnerBlock = {
//     type: "code-runner";
//     code: string;
//     language: string;
//   };
//
//   export type DragSortItem = {
//     id: string;
//     label: string;
//   };
//
//   export type DragSortBlock = {
//     type: "drag-sort";
//     title: string;
//     items: DragSortItem[];
//   };
//
//   export type Blank = {
//     index: number;       // poziția în string-ul content unde apare blank-ul
//     answer: string;
//   };
//
//   export type FillBlanksBlock = {
//     type: "fill-blanks";
//     content: string;     // text cu placeholder-e (ex: "function f(__) { return __; }")
//     blanks: Blank[];
//   };
//
// Actualizează LessonContentNode astfel:
//
//   export type LessonContentNode =
//     | ConceptBlock
//     | StepsBlock
//     | ExampleBlock
//     | ComplexityBlock
//     | FormulaBlock
//     | ProofBlock
//     | TheoremBlock
//     | HeadingBlock
//     | ParagraphBlock
//     | CodeBlock
//     | PredictBlock
//     | ThinkBlock
//     | RecallBlock
//     | InlineQuizBlock
//     | CodeRunnerBlock
//     | DragSortBlock
//     | FillBlanksBlock
//     | { type: string; [key: string]: unknown };  // fallback pentru tipuri viitoare
//
// Nu modifica niciun alt fișier în acest step.
// """

// =============================================================================
// STEP 2 — RE-EXPORT DIN SHARED INDEX
// =============================================================================
// FILES:   shared/src/index.ts
//          shared/src/lesson-content.ts  ← STEP 1
//
// PROMPT:
// """
// În shared/src/index.ts adaugă export pentru toate tipurile noi din STEP 1:
//
//   HeadingBlock, ParagraphBlock, CodeBlock, PredictBlock, ThinkBlock,
//   RecallBlock, RecallQuestion, InlineQuizBlock, CodeRunnerBlock,
//   DragSortBlock, DragSortItem, FillBlanksBlock, Blank
//
// Verifică că exporturile existente din lesson-content.ts nu sunt duplicate.
// Adaugă-le în blocul existent de export din lesson-content.ts, nu într-un bloc separat.
// """

// =============================================================================
// STEP 3 — VERIFICARE TYPESCRIPT
// =============================================================================
// FILES:   toate fișierele din backend/ care importă LessonContentNode
//
// PROMPT:
// """
// Rulează în backend/:
//   npx tsc --noEmit
//
// Așteptat: zero erori noi introduse de STEP 1 și STEP 2.
//
// Dacă apar erori în backend/src/features/lessons-block/domain/types/LessionEngine.type.ts
// sau în orice use case/mapper care face switch/exhaustive check pe LessonContentNode["type"],
// rezolvă-le adăugând case-urile lipsă (fără logică adițională — returnează nodul ca atare).
//
// Verificare explicită:
//   - updateContentBlockUseCase.ts acceptă în continuare noile tipuri fără modificări
//     (cast-ul la LessonContentNode[] e suficient, DTO acceptă orice JSON)
//   - LessonBlockMapper nu necesită modificări (nu face switch pe content nodes)
// """

// =============================================================================
// EDGE CASES BACKEND
// =============================================================================
// - Tipuri noi au fallback în LessonContentNode union — nu există crash dacă FE trimite
//   un tip necunoscut, DTO-ul acceptă orice JSON în data.content
// - drag-sort și fill-blanks au câmpuri cu structuri nested (DragSortItem, Blank) —
//   nu necesită validare strictă în DTO existent; backend le stochează ca JSON orb
// - code-runner și code sunt tipuri diferite: code e static (doar afișat), code-runner
//   e executabil (student scrie cod) — diferența e relevantă doar în FE, BE le stochează identic
// - Fallback-ul { type: string; [key: string]: unknown } trebuie să rămână ultimul
//   în union pentru ca TypeScript să rezolve corect tipul discriminant
// - Nu există limită de noduri per lecție la nivel de DB sau use case —
//   feature doc confirmă că 20+ noduri sunt acceptate

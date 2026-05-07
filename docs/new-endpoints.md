# New Endpoints

Three groups of endpoints were added as part of the lesson navigation feature.

---

## 1. Lesson by Slug

### `GET /api/lessons/slug/:slug`

Returns a single lesson identified by its URL-friendly slug.

**Auth:** Not required.

**Path params:**
| Param  | Type   | Description             |
|--------|--------|-------------------------|
| `slug` | string | The lesson's URL slug   |

**Success response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "moduleId": "uuid",
    "title": "Bubble Sort",
    "slug": "bubble-sort",
    "description": "...",
    "durationSeconds": 3600,
    "position": 0,
    "isActive": true,
    "status": "published",
    "authors": [{ "userId": "uuid", "role": "author" }],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error `404`:** Lesson not found.

**Files added/modified:**
- `application/useCases/getLessonBySlug.usecase.ts` — use case
- `domain/repositories/LeasonRepository.ts` — added `getBySlug` to the interface
- `infrastructure/db/lessonRepoImpl.ts` — Supabase implementation of `getBySlug`
- `interfaces/controller/Lessons.controller.ts` — `getLessonBySlug` controller method
- `infrastructure/factories/lessonControllerFactory.ts` — wired up the new use case
- `interfaces/routes/lessons.routes.ts` — registered `GET /slug/:slug`

---

## 2. Lesson Blocks by Lesson

### `GET /api/lessons-block/lesson/:lessonId`

Returns all blocks for a lesson, sorted by `position` ascending.
Blocks are the atomic content units of a lesson: `content`, `interactive`, or `assessment`.

**Auth:** Not required.

**Path params:**
| Param      | Type   | Description          |
|------------|--------|----------------------|
| `lessonId` | string | UUID of the lesson   |

**Success response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "lessonId": "uuid",
      "position": 0,
      "type": "content",
      "data": { "content": [ /* LessonContentNode[] */ ] }
    },
    {
      "id": "uuid",
      "lessonId": "uuid",
      "position": 1,
      "type": "interactive",
      "engine": "algorithm:bubble-sort",
      "data": { "initialArray": [5, 3, 1, 4, 2] }
    },
    {
      "id": "uuid",
      "lessonId": "uuid",
      "position": 2,
      "type": "assessment",
      "engine": "quiz:mcq",
      "data": {
        "question": "What is the worst-case complexity of bubble sort?",
        "options": ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        "correctIndex": 2
      }
    }
  ]
}
```

**Block types:**
- `content` — Rich content (concept, steps, example, complexity, formula, proof, theorem).
- `interactive` — Algorithm visualiser or math formula renderer. The `engine` key identifies the specific widget.
- `assessment` — Quiz. Engine variants: `quiz:mcq`, `quiz:input`, `quiz:code`.

**Files added/modified:**
- `application/useCases/getBlocksByLessonIdUseCase.ts` — use case
- `interfaces/controller/lessonBlock.controller.ts` — `findByLessonId` method
- `infrastructure/factories/lessonBlockController.factory.ts` — wired up the new use case
- `interfaces/routes/lessonBlock.routes.ts` — registered `GET /lesson/:lessonId`

---

## 3. User Lesson Progress

All progress endpoints require an authenticated user (cookie-based JWT).

### `GET /api/progress/lesson/:lessonId`

Returns the current user's progress record for a lesson.
Returns `data: null` (not 404) when the user has not started the lesson yet.

**Auth:** Required (`accessToken` cookie).

**Path params:**
| Param      | Type   | Description        |
|------------|--------|--------------------|
| `lessonId` | string | UUID of the lesson |

**Success response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "lessonId": "uuid",
    "status": "in_progress",
    "weightedScore": 40,
    "quizScore": 60,
    "readScore": 30,
    "outputScore": 30,
    "lastActivityAt": "2024-06-01T12:00:00.000Z",
    "createdAt": "2024-05-01T00:00:00.000Z",
    "updatedAt": "2024-06-01T12:00:00.000Z"
  }
}
```
`data: null` when no progress row exists yet.

**Error `401`:** Not authenticated.

---

### `PATCH /api/progress/lesson/:lessonId`

Creates or updates the user's progress for a lesson (upsert).
All body fields are optional — only the supplied fields update the record.
`weightedScore` is computed automatically as `Math.round((quizScore + readScore + outputScore) / 3)`.

**Auth:** Required.

**Path params:** Same as GET above.

**Request body (all optional):**
```json
{
  "status": "in_progress",
  "quizScore": 80,
  "readScore": 60,
  "outputScore": 40
}
```
`status` values: `"not_started"` | `"in_progress"` | `"completed"`

**Success response `200`:** Same shape as the GET response.

**Error `401`:** Not authenticated.

**Files added (new feature `src/features/progress/`):**
- `domain/types/LessonProgress.type.ts` — domain types
- `domain/repositories/ProgressRepository.ts` — repository interface
- `application/useCases/getLessonProgressUseCase.ts` — read use case
- `application/useCases/upsertLessonProgressUseCase.ts` — write use case
- `infrastructure/db/ProgressRepoImpl.ts` — Supabase implementation
- `infrastructure/factories/progressControllerFactory.ts` — DI wiring
- `interfaces/controller/progress.controller.ts` — HTTP controller
- `interfaces/routes/progress.routes.ts` — route definitions
- `src/app.ts` — registered `app.use("/api/progress", progressRoutes)`

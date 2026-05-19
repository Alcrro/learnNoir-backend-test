# Feature: lessons

Core lesson management — creation, editing, publishing, review workflow, and AI-powered block generation. This is the central feature of the platform; most other features (blocks, activities, exercises, audio, video) attach to a lesson.

---

## Responsibilities

- Full CRUD for lessons (teacher / admin only for writes)
- Lesson publishing workflow: `draft → review → published`
- List lessons by module (ID or slug) for student browsing
- Teacher dashboard: own lessons, stats, enrolled students
- AI-assisted block generation from free-form text input
- Lesson edit history

---

## Architecture

```
lessons/
  domain/
    entities/Lesson.ts                  # Lesson entity + invariants
    repositories/LessonRepository.ts    # Write repository interface
    types/Lesson.type.ts                # Status enum, domain types
    types/LessionEngine.type.ts         # Block engine union types (re-exported from @shared)
    AlgorithmTamplete.ts                # Algorithm lesson template
  application/
    dto/
      LessonDTO.dto.ts
      LessonType.type.ts
      TeacherLessons.dto.ts
      lesson.schema.ts                  # Zod: CreateLessonSchema, UpdateLessonSchema, GenerateBlocksSchema
    repositories/ILessonQueryRepository.ts  # Read-optimised query interface
    useCases/                           # 14 use cases (see below)
    composition/createServices.ts       # Shared service composition
  infrastructure/
    db/lessonRepoImpl.ts                # Supabase write repo
    db/lessonQueryRepoImpl.ts           # Supabase read/query repo
    ai/openai.service.ts                # OpenAI wrapper
    ai/lessonAI.service.ts              # Lesson-specific AI service
    ai/lessonPrompts.ts                 # Prompt templates
    cache/cache.service.ts              # Redis caching for lessons
    mapper/lesson.mapper.ts
    mapper/LessonBlock.mapper.ts
    inMemory/InMemory.ts                # In-memory lesson store (dev/test)
    factories/lessonControllerFactory.ts
  interfaces/
    controllers/
      Lessons.controller.ts
      lessonAI.controller.ts
      math.controller.ts
    routes/
      lessons.routes.ts
      lessonAI.routes.ts
      docs.routes.ts
  __tests__/
    CreateLessonUseCase.test.ts
    DeletePublishReviewLesson.test.ts
    LessonEntity.test.ts
    UpdateLessonUseCase.test.ts
```

---

## Use Cases

| Use Case | Description |
|---|---|
| `createLesson` | Create a new draft lesson |
| `updateLesson` | Update lesson metadata or content |
| `deleteLesson` | Soft-delete a lesson |
| `publishLesson` | Move lesson to `published` state |
| `reviewLesson` | Move lesson to `review` state |
| `getLesson` | Fetch lesson by ID |
| `getLessonBySlug` | Fetch lesson by URL slug |
| `listLessons` | List all published lessons |
| `listLessonsByModuleId` | List lessons for a module (by ID) |
| `listLessonsByModuleSlug` | List lessons for a module (by slug) |
| `listTeacherLessons` | List lessons created by the authenticated teacher |
| `getTeacherStats` | Aggregate stats for teacher dashboard |
| `getTeacherStudents` | List students enrolled in teacher's lessons |
| `getLessonHistory` | Return edit history for a lesson |
| `generateBlocksFromText` | Send free-form text to OpenAI and return structured blocks |

---

## API Endpoints

### Public / Student

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/lessons` | Public | List all published lessons |
| `GET` | `/api/lessons/:id` | Public | Get lesson by ID |
| `GET` | `/api/lessons/slug/:slug` | Public | Get lesson by slug |
| `GET` | `/api/lessons/module/id/:moduleId` | Public | List lessons by module ID |
| `GET` | `/api/lessons/module/slug/:slug` | Public | List lessons by module slug |

### Teacher / Admin

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/lessons` | Teacher+ | Create lesson |
| `PUT` | `/api/lessons/:id` | Teacher+ | Update lesson |
| `DELETE` | `/api/lessons/:id` | Teacher+ | Delete lesson |
| `PATCH` | `/api/lessons/:id/publish` | Teacher+ | Publish lesson |
| `PATCH` | `/api/lessons/:id/review` | Teacher+ | Submit for review |
| `GET` | `/api/lessons/mine` | Teacher+ | List own lessons |
| `GET` | `/api/lessons/mine/stats` | Teacher+ | Teacher dashboard stats |
| `GET` | `/api/lessons/mine/students` | Teacher+ | Enrolled students |
| `GET` | `/api/lessons/:id/history` | Teacher+ | Edit history |
| `POST` | `/api/lessons/:id/generate-blocks` | Teacher+ | AI block generation |

### AI Routes (`/api/lessons/ai`)

Used internally by the teacher editor to generate and refine lesson content via OpenAI.

---

## Lesson Status Workflow

```
draft ──► review ──► published
  ▲                    │
  └────────────────────┘ (can revert to draft)
```

---

## AI Block Generation

`POST /api/lessons/:id/generate-blocks` accepts `{ text: string }`, sends it through the policy system (`promptPolicies.ts`) to OpenAI, and returns a `LessonBlock[]` array ready to be saved.

The policy layer enforces:
1. A fixed system prompt that defines block format and safety rules
2. Output validation against the `LessonBlock` Zod schema
3. Redis caching of identical inputs

---

## Validation

| Endpoint | Schema |
|---|---|
| `POST /api/lessons` | `CreateLessonSchema` |
| `PUT /api/lessons/:id` | `UpdateLessonSchema` |
| `POST /api/lessons/:id/generate-blocks` | `GenerateBlocksSchema` — `{ text: string }` |

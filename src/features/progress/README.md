# Feature: progress

Tracks per-user learning progress at the lesson and quiz-block levels. Provides an aggregate view of what a student has completed across all lessons.

---

## Responsibilities

- Upsert lesson progress (started, completed, percentage)
- Upsert quiz block scores (per block, per attempt)
- Query progress for a single lesson
- Query all progress for the authenticated user
- Query quiz block scores for a lesson

---

## Architecture

```
progress/
  domain/
    repositories/ProgressRepository.ts
    types/LessonProgress.type.ts
  application/
    useCases/
      upsertLessonProgressUseCase.ts
      upsertQuizBlockScoreUseCase.ts
      getLessonProgressUseCase.ts
      getUserProgressUseCase.ts
      getQuizBlockScoresUseCase.ts
  infrastructure/
    db/ProgressRepoImpl.ts
    factories/progressControllerFactory.ts
  interfaces/
    controller/progress.controller.ts
    routes/progress.routes.ts
```

---

## API Endpoints

All endpoints require authentication.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/progress` | Get all progress for the authenticated user |
| `GET` | `/api/progress/lesson/:lessonId` | Get progress for a specific lesson |
| `POST` | `/api/progress/lesson/:lessonId` | Upsert lesson progress |
| `GET` | `/api/progress/lesson/:lessonId/quiz-scores` | Get quiz block scores for a lesson |
| `POST` | `/api/progress/quiz-block/:blockId` | Upsert score for a quiz block |

---

## Data Model

### Lesson Progress

| Field | Type | Notes |
|---|---|---|
| `userId` | `string` | |
| `lessonId` | `string` | |
| `status` | `"not_started" \| "in_progress" \| "completed"` | |
| `percentage` | `number` | 0–100 |
| `lastAccessedAt` | `string` | ISO timestamp |

### Quiz Block Score

| Field | Type | Notes |
|---|---|---|
| `userId` | `string` | |
| `blockId` | `string` | |
| `score` | `number` | |
| `maxScore` | `number` | |
| `attempts` | `number` | |

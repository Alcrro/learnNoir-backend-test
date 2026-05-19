# Feature: lesson-activities

Tracks the ordered list of activities (steps / sections) within a lesson. An activity can represent a discrete section of a lesson that a student works through — not to be confused with raw progress (which lives in the `progress` feature).

---

## Responsibilities

- CRUD for lesson activities attached to a lesson
- Reorder activities (drag-and-drop support)
- List all activities for a lesson in order

---

## Architecture

```
lesson-activities/
  domain/
    entities/LessonActivityEntity.ts
    repositories/LessonActivityRepository.ts
    types/LessonActivity.type.ts
  application/
    dto/LessonActivity.dto.ts
    useCases/
      createLessonActivityUseCase.ts
      deleteLessonActivityUseCase.ts
      getLessonActivitiesByLessonUseCase.ts
      getLessonActivityUseCase.ts
      reorderLessonActivityUseCase.ts
  infrastructure/
    db/LessonActivityRepoImpl.ts
    mapper/LessonActivity.mapper.ts
    types/lessonActivityDatabase.types.ts
    factories/lessonActivityController.factory.ts
  interfaces/
    controller/lessonActivity.controller.ts
    routes/lessonActivity.routes.ts
  __tests__/
    CreateLessonActivityUseCase.test.ts
    DeleteReorderLessonActivity.test.ts
    LessonActivityEntity.test.ts
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/lesson-activities/lesson/:lessonId` | Auth | List all activities for a lesson |
| `GET` | `/api/lesson-activities/:id` | Auth | Get a single activity |
| `POST` | `/api/lesson-activities` | Teacher+ | Create an activity |
| `DELETE` | `/api/lesson-activities/:id` | Teacher+ | Delete an activity |
| `PATCH` | `/api/lesson-activities/reorder` | Teacher+ | Reorder activities |

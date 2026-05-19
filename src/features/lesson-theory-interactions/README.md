# Feature: lesson-theory-interactions

AI-generated interactive components embedded in lesson theory sections (V2 learning layout). Teachers trigger generation for specific component types; students engage with approved components and submit attempts. Requires a Pro subscription for full access.

---

## Responsibilities

- Teacher: generate AI interaction components for a lesson, approve or update them
- Student: view approved components, engage with them, record attempts
- Both: per-component feedback (thumbs up/down + preset options)
- Track which components a student has completed (`my-progress`)

---

## Architecture

```
lesson-theory-interactions/
  domain/
    repositories/
      ILessonTheoryInteractionsRepo.ts
      ITheoryInteractionAttemptRepo.ts
      IComponentFeedbackRepo.ts
      IFeedbackOptionsRepo.ts
      IUserActivityProgressRepo.ts
    types/
      LessonTheoryInteraction.type.ts
      TheoryInteractionAttempt.type.ts
      ComponentFeedback.type.ts
      FeedbackOption.type.ts
  application/
    dto/LessonTheoryInteraction.dto.ts
    useCases/
      GenerateTheoryInteraction.ts      # OpenAI generation
      ApproveInteraction.ts
      UpdateInteraction.ts
      GetLessonInteractions.ts          # Approved only (student)
      GetAll.ts                         # All statuses (teacher)
      GetUserTheoryAttempts.ts
      RecordTheoryAttempt.ts
      EngageTheoryComponent.ts          # Marks component as engaged
      GetUserEngagedComponents.ts
      GetComponentFeedback.ts
      UpsertComponentFeedback.ts
      DeleteComponentFeedback.ts
      GetFeedbackOptions.ts
  infrastructure/
    db/
      LessonTheoryInteractionsRepoImpl.ts
      TheoryInteractionAttemptRepoImpl.ts
      ComponentFeedbackRepoImpl.ts
      FeedbackOptionsRepoImpl.ts
      UserActivityProgressRepoImpl.ts
    ai/LessonTheoryInteractionsAIService.ts
    factories/LessonTheoryInteractionsFactory.ts
  interfaces/
    controllers/LessonTheoryInteractions.controller.ts
    routes/LessonTheoryInteractions.routes.ts
```

---

## API Endpoints

All endpoints are nested under `/api/lessons/:lessonId/theory-interactions`.

### Student Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Auth + Pro | Get all approved interactions for the lesson |
| `GET` | `/my-attempts` | Auth | Get user's attempt history |
| `GET` | `/my-progress` | Auth | Which component types the user has engaged |
| `POST` | `/engage` | Auth + Pro | Record engagement with a theory component |
| `POST` | `/:interactionId/attempt` | Auth + Pro | Submit an attempt for an interaction |

### Feedback Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/:componentId/feedback-options` | Auth | Get available feedback preset labels |
| `GET` | `/:componentId/feedback` | Auth | Get user's current feedback for a component |
| `POST` | `/:componentId/feedback` | Auth | Create or update feedback (upsert) |
| `DELETE` | `/:componentId/feedback` | Auth | Remove feedback |

### Teacher Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/all` | Teacher+ | Get all interactions (any status) |
| `POST` | `/:component/generate` | Teacher+ | Generate an AI interaction for a component type |
| `PATCH` | `/:interactionId/approve` | Teacher+ | Approve an interaction for student access |
| `PATCH` | `/:interactionId` | Teacher+ | Update an existing interaction |

---

## Interaction Lifecycle

```
Teacher triggers generate ──► AI returns component ──► stored as "pending"
                              ──► Teacher approves ──► status = "approved"
                                                     ──► Students can access
```

---

## Engage vs Attempt

- **Engage** (`POST /engage`): A lightweight signal that a student opened/interacted with a component. Works even if no approved interaction exists yet. Used for progress tracking.
- **Attempt** (`POST /:id/attempt`): A scored submission tied to a specific approved interaction — records the student's answer and whether it was correct.

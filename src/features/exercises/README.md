# Feature: exercises

LeetCode-style coding exercises attached to lessons. Students write JavaScript solutions that are executed inside a sandboxed Node.js VM and validated against test cases. Access to the full exercise list requires a Pro subscription.

---

## Responsibilities

- Provide exercises scoped to a lesson
- Execute student code safely in isolation
- Record attempt history and track per-user progress
- Return a public preview (first 2 exercises) for free-tier users

---

## Architecture

```
exercises/
  domain/
    repositories/
      IExerciseRepo.ts
      IExerciseAttemptRepo.ts
    types/Exercise.type.ts
  application/
    useCases/
      GetExercisesByLesson.ts       # Pro: full exercise list
      GetExercisesPreview.ts        # Public: first 2 exercises
      GetMyExerciseProgress.ts      # Per-user completion status
      RunCode.ts                    # Execute code, return output
      SubmitExercise.ts             # Run + record attempt
  infrastructure/
    db/
      ExerciseRepoImpl.ts
      ExerciseAttemptRepoImpl.ts
    sandbox/NodeSandbox.ts          # vm2 isolated VM execution
    factories/ExerciseFactory.ts
  interfaces/
    controllers/Exercise.controller.ts
    routes/exercise.routes.ts
```

---

## API Endpoints

### Lesson-scoped (`/api/lessons/:lessonId/exercises`)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/preview` | Public | First 2 exercises (free tier) |
| `GET` | `/my-progress` | Auth | User's completion status per exercise |
| `GET` | `/` | Auth + Pro | Full exercise list for the lesson |

### Exercise-scoped (`/api/exercises/:exerciseId`)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/:exerciseId/run` | Auth | Execute code and return output (no save) |
| `POST` | `/:exerciseId/submit` | Auth | Execute code + record attempt |

---

## Code Execution Sandbox

Student code runs inside a `vm2` VM context:

- No `require` / `import` access
- No filesystem or network access
- Execution timeout enforced
- Output and errors are captured and returned to the client

The `NodeSandbox` service wraps `vm2` and exposes a `run(code, testCases)` method. Test cases are injected into the VM as constants before running the student function.

---

## Paywall

`GET /api/lessons/:lessonId/exercises/` requires `requireProMiddleware`. The preview endpoint is intentionally public to encourage upgrades. The run/submit endpoints require auth (to prevent compute abuse) but not a Pro plan — students can run code after unlocking exercises.

---

## Progress Tracking

Each submission is recorded in `exercise_attempts` (timestamp, code snapshot, result). `GetMyExerciseProgress` aggregates these to return a `{ exerciseId: boolean }` map showing which exercises the student has solved.

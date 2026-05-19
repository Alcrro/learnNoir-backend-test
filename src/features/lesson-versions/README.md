# Feature: lesson-versions

Lesson version history — snapshot a lesson's current state, list past versions, and restore (publish) a specific version. Gives teachers a basic audit trail and rollback capability.

---

## Responsibilities

- Snapshot the current lesson state into a versioned record
- List all versions for a lesson (in reverse chronological order)
- Retrieve a specific version's content
- Publish (restore) a version as the current lesson content

---

## Architecture

```
lesson-versions/
  domain/
    repositories/ILessonVersionRepository.ts
    types/LessonVersion.type.ts
  application/
    useCases/
      createLessonVersion.ts
      listLessonVersions.ts
      getLessonVersion.ts
      publishLessonVersion.ts
  infrastructure/
    db/LessonVersionRepoImpl.ts
    factories/lessonVersionController.factory.ts
  interfaces/
    controller/LessonVersion.controller.ts
    routes/lessonVersion.routes.ts
```

---

## API Endpoints

All endpoints are nested under `/api/lessons/:lessonId/versions` and require Teacher+ access.

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | List all versions for the lesson |
| `POST` | `/` | Create a new version snapshot |
| `GET` | `/:versionId` | Get a specific version |
| `POST` | `/:versionId/publish` | Restore a version as current content |

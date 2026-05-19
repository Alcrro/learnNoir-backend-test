# Feature: lesson-video

AI-generated video for lessons. Mirrors the architecture of `lesson-audio` — a teacher triggers generation, the video is stored, and students can access it from the lesson view.

---

## Responsibilities

- Generate a video for a lesson via an AI video service (provider TBD)
- Store the result and its metadata
- Retrieve the video URL for a lesson

---

## Architecture

```
lesson-video/
  domain/
    repositories/LessonVideoRepository.ts
    types/lessonVideo.types.ts
  application/
    useCases/
      generateLessonVideoUseCase.ts
      getLessonVideoUseCase.ts
  infrastructure/
    ai/LessonVideoAIService.ts          # Video generation API wrapper
    db/LessonVideoRepoImpl.ts
    factories/lessonVideoController.factory.ts
  interfaces/
    controller/lessonVideo.controller.ts
    routes/lessonVideo.routes.ts
```

---

## API Endpoints

Routes are mounted under `/api/lessons` (merged with the lessons router).

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/lessons/:lessonId/video` | Auth | Get video URL for a lesson |
| `POST` | `/api/lessons/:lessonId/video/generate` | Teacher+ | Generate lesson video |

---

## Notes

The video generation provider is not finalised (`provider TBD` in CLAUDE.md). `LessonVideoAIService` wraps whichever external API is chosen without leaking it into the application layer.

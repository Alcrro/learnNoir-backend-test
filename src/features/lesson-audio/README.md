# Feature: lesson-audio

AI-generated audio narration for lessons. A teacher triggers generation; the resulting audio file is stored in Supabase Storage and its URL is saved in the database. Students can play it from the lesson's "Watch" tab.

---

## Responsibilities

- Generate an audio narration for a lesson via an AI text-to-speech service
- Store the audio file in Supabase Storage
- Retrieve the audio URL for a lesson

---

## Architecture

```
lesson-audio/
  domain/
    repositories/LessonAudioRepository.ts
    types/lessonAudio.types.ts
  application/
    useCases/
      generateLessonAudioUseCase.ts   # Calls AI, stores file, saves record
      getLessonAudioUseCase.ts         # Returns audio URL for a lesson
  infrastructure/
    ai/LessonAudioAIService.ts         # Text-to-speech API wrapper
    storage/SupabaseAudioStorage.ts    # Supabase Storage upload
    db/LessonAudioRepoImpl.ts
    factories/lessonAudioController.factory.ts
  interfaces/
    controller/lessonAudio.controller.ts
    routes/lessonAudio.routes.ts
```

---

## API Endpoints

Routes are mounted under `/api/lessons` (merged with the lessons router).

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/lessons/:lessonId/audio` | Auth | Get audio URL for a lesson |
| `POST` | `/api/lessons/:lessonId/audio/generate` | Teacher+ | Generate audio narration |

---

## Generation Flow

```
Teacher POST /generate
  ──► LessonAudioAIService (TTS)
  ──► SupabaseAudioStorage (upload)
  ──► LessonAudioRepoImpl (save URL)
  ──► return { url }
```

Generation is synchronous — the request waits for TTS + upload to complete before responding.

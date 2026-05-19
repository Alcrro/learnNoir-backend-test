# Feature: lessons-block

Manages the atomic content units that make up a lesson. Each block has a discriminated type (`content`, `interactive`, or `assessment`) and an optional engine key that maps to a specific frontend renderer.

---

## Responsibilities

- CRUD for individual lesson blocks
- Enforcing the block type system (type-safe `engine` + `data` pairing)
- Preview endpoint returning the first N blocks (for paywall gating)
- Ordered block retrieval for lesson rendering

---

## Architecture

```
lessons-block/
  domain/
    entities/
      BaseBlockEntity.ts
      ContentBlockEntity.ts
      InteractiveBlockEntity.ts
      AssessmentBlockEntity.ts
      LessonBlockEntity.ts              # Union entity
    factories/lessonBlock.factory.ts    # Entity construction from raw data
    repositories/LessonBlockRepository.ts
    types/LessionEngine.type.ts         # Re-exported from @shared/lesson-block
  application/
    dto/LessonBlock.dto.ts
    useCases/
      createLessonBlockUseCase.ts
      getBlocksByLessonIdUseCase.ts
      getLessonBlockUsecase.ts
      GetBlocksPreviewUseCase.ts        # Returns first 2 blocks (free tier)
      updateContentBlockUseCase.ts
  infrastructure/
    db/LessonBlockRepoImpl.ts
    mapper/LessonBlock.mapper.ts
    types/lessonBlockDatabase.types.ts
    factories/lessonBlockController.factory.ts
  interfaces/
    controller/lessonBlock.controller.ts
    routes/lessonBlock.routes.ts
  __tests__/
    BlockEntities.test.ts
    GetBlocksPreviewUseCase.test.ts
    LessonBlockFactory.test.ts
    UpdateCreateBlock.test.ts
```

---

## Block Type System

All block types share the `LessonBlock` union discriminated on `type`:

### `content`

Rich educational content. The `data` field contains a tree of `LessonContentNode` elements (text, code, image, list, heading, etc.).

### `interactive`

Interactive visualisations keyed by `engine: InteractiveEngine`. Examples:

| Engine key | Description |
|---|---|
| `"algorithm:bubble-sort"` | Bubble sort step-through visualiser |
| `"math:formula"` | LaTeX formula renderer |

### `assessment`

Quiz and coding challenges keyed by `engine: AssessmentEngine`. Examples:

| Engine key | Description |
|---|---|
| `"quiz:mcq"` | Multiple choice question |
| `"quiz:input"` | Short text input answer |
| `"quiz:code"` | Code evaluation answer |

The type system is defined in `@shared/lesson-block` and re-exported here. Each engine key maps to a specific `data` shape enforced at the TypeScript level using mapped types — adding a new engine requires a matching `data` type.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/lessons-block/lesson/:lessonId` | Auth | Get all blocks for a lesson |
| `GET` | `/api/lessons-block/lesson/:lessonId/preview` | Public | First 2 blocks (free tier) |
| `GET` | `/api/lessons-block/:blockId` | Auth | Get a single block |
| `POST` | `/api/lessons-block` | Teacher+ | Create a block |
| `PUT` | `/api/lessons-block/:blockId` | Teacher+ | Update a block |
| `DELETE` | `/api/lessons-block/:blockId` | Teacher+ | Delete a block |

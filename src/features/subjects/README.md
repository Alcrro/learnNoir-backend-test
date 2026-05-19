# Feature: subjects

Top-level curriculum subjects (e.g. Computer Science, Mathematics). Each subject contains categories, which contain modules, which contain lessons.

---

## Responsibilities

- Create subjects (admin)
- List all subjects with optional stats (lesson counts, student counts)

---

## Architecture

```
subjects/
  domain/
    entities/SubjectEntity.ts
    repositories/
      SubjectsRepository.interfaces.ts
    types/Subjects.types.ts
  application/
    dto/
      subjectDTO.ts
      subjectCardDto.ts
      getSubjectsWithStats.usecase.ts   # DTO for stats projection
    repositories/subjects.interfaces.ts
    useCases/
      createSubjectUsecase.ts
      getSubjectsStatsUsecase.ts
  infrastructure/
    db/
      SubjectsRepoImpl.ts               # Write repo
      SubjectQueryRepositoryImpl.ts     # Read / stats repo
    mapper/
      SubjectsMapper.ts
      SubjectQueryMapper.ts
    cache/                              # Redis caching for subject lists
    factories/subjectFactory.ts
  interfaces/
    controller/SubjectsController.ts
    routes/SubjectsRoute.routes.ts
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/subjects` | Public | List all subjects (with stats) |
| `POST` | `/api/subjects` | Admin | Create a subject |

---

## Caching

Subject listings are cached in Redis to avoid repeated DB queries on heavily-visited pages. Cache is invalidated on write.

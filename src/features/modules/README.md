# Feature: modules

Course modules group related lessons under a subject. A module sits one level below a subject in the content hierarchy: `Subject → Category → Module → Lesson`.

---

## Responsibilities

- Create modules (admin / teacher)
- List all modules (public)

---

## Architecture

```
modules/
  domain/
    entities/ModulesEntity.ts
    repositories/modulesRepository.interfaces.ts
    types/modules.type.ts
  application/
    dto/ModulesDto.ts
    useCases/
      createModuleUsecase.ts
      getAllModulesUsecase.ts
  infrastructure/
    db/ModulesRepoImpl.ts
    mapper/modulesMapper.mapper.ts
    factories/modulesControllerFactory.factory.ts
  interfaces/
    http/
      controller/modules.controller.ts
      routes/ModulesRouter.routes.ts
```

---

## Content Hierarchy

```
Subject
  └── Category
        └── Module
              └── Lesson
                    └── Block
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/modules` | Public | List all modules |
| `POST` | `/api/modules` | Teacher+ | Create a module |

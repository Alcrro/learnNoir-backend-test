# Feature: categories

Content categories that sit between subjects and modules in the content hierarchy. A category belongs to a subject and groups related modules (e.g. "Sorting Algorithms" inside "Computer Science").

---

## Responsibilities

- Create categories (admin / teacher)
- List all categories
- List categories with their nested modules (for navigation trees)

---

## Architecture

```
categories/
  domain/
    entities/CategoriesEntitity.ts
    repositories/CategoryRepository.ts
    types/Categories.type.ts
  application/
    dto/
      CategoryDTO.ts
      CategoryQueryDTO.ts
      CategoryWithModulesDTO.ts
    repositories/CategoriesRepository.interfaces.ts
    useCases/
      createCategoriesUsecase.ts
      getAllCategoriesUsecase.ts
      getCategoriesWithModulesUseCase.ts
  infrastructure/
    db/
      CategoriesRepoImpl.ts
      CategoriesQueryRepoImpl.ts
    mapper/
      CategoriesMapper.ts
      SubjectQueryMapper.ts
    cache/                              # Redis caching for category lists
    factories/CategoriesFactory.ts
  interfaces/
    controller/CategoriesController.ts
    routes/http/CategoriesRouter.route.ts
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | List all categories |
| `GET` | `/api/categories/with-modules` | Public | Categories with nested module list |
| `POST` | `/api/categories` | Teacher+ | Create a category |

---

## Caching

Category lists (especially `with-modules`) are cached in Redis because they are fetched on every page load for navigation rendering.

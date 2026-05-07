import { Router } from "express";
import { CategoriesFactory } from "../../../infrastructure/factories/CategoriesFactory";
import { validateInput } from "../../../../../utils/validateInputMiddleware";
import { CreateCategorySchema } from "../../../application/dto/CategoryDTO";

const router = Router();

const { create, getAllCategoriesQuery, getCategoriesWithModules } = CategoriesFactory();
router.post("/", validateInput(CreateCategorySchema), create);
router.get("/stats", getAllCategoriesQuery);
router.get("/by-subject/:slug", getCategoriesWithModules);

export default router;

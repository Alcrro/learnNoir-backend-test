import { Router } from "express";
import { subjectFactory } from "../../infrastructure/factories/subjectFactory";
import { validateInput } from "../../../../utils/validateInputMiddleware";
import { SubjectSchema } from "../../application/dto/subjectDTO";

const router = Router();

const { createSubject, getSubjectsStats } = subjectFactory();
// Define your routes here
// For example:
router.post("/", validateInput(SubjectSchema), createSubject);
router.get("/", getSubjectsStats);
router.get("/stats", getSubjectsStats);

export default router;

import { Router } from "express";
import { generateResponse } from "../controller/openai.controller";

const router = Router();

router.post("/generate", generateResponse);

export default router;

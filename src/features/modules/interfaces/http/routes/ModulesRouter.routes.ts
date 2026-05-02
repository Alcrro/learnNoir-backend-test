import { Router } from "express";
import { useModulesControllerFactory } from "../../../infrastructure/factories/modulesControllerFactory.factory";

const router = Router();

const { create, getAll } = useModulesControllerFactory();

router.post("", create);
router.get("", getAll);

export default router;

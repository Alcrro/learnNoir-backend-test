import { Router } from "express";
import { useModulesControllerFactory } from "../../../infrastructure/factories/modulesControllerFactory.factory";
import { validateInput } from "../../../../../utils/validateInputMiddleware";
import { CreateModuleSchema } from "../../../application/dto/ModulesDto";

const router = Router();

const { create, getAll } = useModulesControllerFactory();

router.post("", validateInput(CreateModuleSchema), create);
router.get("", getAll);

export default router;

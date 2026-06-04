import type { ModulesEntity } from "../entities/ModulesEntity";

export interface ModulesRepository {
	create(module: ModulesEntity): Promise<ModulesEntity>;
	findById(id: string): Promise<ModulesEntity>;
	findBySlug(slug: string): Promise<ModulesEntity | null>;
	findAll(): Promise<ModulesEntity[]>;
	update(id: string, module: ModulesEntity): Promise<ModulesEntity>;
	delete(id: string): Promise<void>;
}

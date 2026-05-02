import type { Module } from "../../domain/types/modules.type";

type CreateModuleOutputDto = Module;

import { z } from "zod";

export const CreateModuleSchema = z.object({
	name: z.string(),
	slug: z.string(),
	position: z.number(),
	categoryId: z.string(),
});

export type CreateModuleInputDto = z.infer<typeof CreateModuleSchema>;

export function toCreateModuleOutputDto(module: CreateModuleOutputDto) {
	return {
		id: module.id,
		categoryId: module.categoryId,
		name: module.name,
		slug: module.slug,
		position: module.position,
		createdAt: module.created_at,
	};
}

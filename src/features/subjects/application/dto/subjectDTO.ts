import z from "zod";
import type { Subject } from "../../domain/types/Subjects.types";
import type { SubjectEntity } from "../../domain/entities/SubjectEntity";

export type SubjectOutputDTO = Subject;

export const SubjectSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	description: z.string().optional(),
	position: z.number().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type SubjectInputDTO = z.infer<typeof SubjectSchema>;

export function toSubjectDTO(subject: SubjectEntity): SubjectOutputDTO {
	return {
		id: subject.id,
		name: subject.name,
		description: subject.description ?? "",
		slug: subject.slug,
		position: subject.position,
		created_at: subject.created_at,
		updated_at: subject.updated_at,
	};
}

import type { Database } from "../../../../database.types";
import { SubjectEntity } from "../../domain/entities/SubjectEntity";

type SubjectDatabase = Database["public"]["Tables"]["subjects"]["Row"];
export class SubjectsMapper {
	static toDomain(raw: SubjectDatabase): SubjectEntity {
		return new SubjectEntity({
			id: raw.id,
			name: raw.name,
			slug: raw.slug,
			position: raw.order ?? 0,
			description: raw.description ?? "",
			created_at: new Date(raw.created_at || Date.now()),
			updated_at: new Date(raw.updated_at || Date.now()),
		});
	}

	static toPersistence(subject: SubjectEntity): SubjectDatabase {
		return {
			id: subject.id,
			name: subject.name,
			slug: subject.slug,
			description: subject.description || null, // Assuming description is not part of the domain model, set it to an empty string or handle it as needed
			order: subject.position,
			created_at: subject.created_at.toLocaleDateString(),
			updated_at: subject.updated_at.toLocaleDateString(),
		};
	}
}

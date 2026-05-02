import { SubjectEntity } from "../../domain/entities/SubjectEntity";
import type { SubjectsRepository } from "../../domain/repositories/SubjectsRepository.interfaces";
import {
	toSubjectDTO,
	type SubjectInputDTO,
	type SubjectOutputDTO,
} from "../dto/subjectDTO";

export class createSubjectUsecase {
	constructor(private readonly subjectRepository: SubjectsRepository) {
		// Initialize any dependencies or services needed for creating a subject
	}

	async execute(subjectData: SubjectInputDTO): Promise<SubjectOutputDTO> {
		// Validate the input data (you can use a validation library or custom validation logic)
		if (!subjectData.name) {
			throw new Error("Subject name is required");
		}

		const subjectEntity = new SubjectEntity({
			id: crypto.randomUUID(),
			name: subjectData.name,
			slug: this.generateSlug(subjectData.name),
			description: subjectData.description ?? "Unknown description",
			position: subjectData.position ?? 1,
			created_at: new Date(),
			updated_at: new Date(),
		});
		// Create a new subject using the repository
		const newSubject = await this.subjectRepository.create(subjectEntity);

		// Return the created subject
		return toSubjectDTO(newSubject);
	}

	private generateSlug(name: string) {
		return name.toLowerCase().replace(/\s+/g, "-");
	}
}

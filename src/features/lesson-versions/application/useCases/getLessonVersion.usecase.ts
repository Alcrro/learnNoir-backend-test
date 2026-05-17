import type { ILessonVersionRepository } from "../../domain/repositories/ILessonVersionRepository.ts";
import type { LessonVersion } from "../../domain/types/LessonVersion.type.ts";
import { NotFoundError } from "../../../../utils/errors/DatabaseError.ts";

export class GetLessonVersionUseCase {
	constructor(private readonly repo: ILessonVersionRepository) {}

	async execute(id: string): Promise<LessonVersion> {
		const version = await this.repo.findById(id);
		if (!version) throw new NotFoundError("Lesson version not found");
		return version;
	}
}

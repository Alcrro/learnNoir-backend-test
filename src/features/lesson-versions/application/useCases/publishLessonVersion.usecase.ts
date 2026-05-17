import type { ILessonVersionRepository } from "../../domain/repositories/ILessonVersionRepository.ts";
import { NotFoundError } from "../../../../utils/errors/DatabaseError.ts";

export class PublishLessonVersionUseCase {
	constructor(private readonly repo: ILessonVersionRepository) {}

	async execute(id: string, publish: boolean): Promise<void> {
		const version = await this.repo.findById(id);
		if (!version) throw new NotFoundError("Lesson version not found");

		if (publish) {
			await this.repo.publish(id);
		} else {
			await this.repo.unpublish(id);
		}
	}
}

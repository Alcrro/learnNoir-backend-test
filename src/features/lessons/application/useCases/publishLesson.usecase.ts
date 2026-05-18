import type { ILessonRepository } from "../../domain/repositories/LessonRepository";
import type { role } from "../../../profiles/application/dto/ProfileDTO.type";
import { ForbiddenError } from "../../../../utils/errors/DatabaseError";

export class PublishLessonUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(id: string, requesterId: string, requesterRole: role): Promise<void> {
		if (requesterRole !== "admin") {
			const lesson = await this.lessonRepo.get(id);
			if (!lesson.authors.some((a) => a.userId === requesterId)) {
				throw new ForbiddenError("You are not an author of this lesson");
			}
		}
		await this.lessonRepo.publish(id);
	}
}

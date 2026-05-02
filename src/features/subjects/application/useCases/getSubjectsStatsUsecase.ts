import type { GetSubjectsWithStatsInput } from "../dto/getSubjectsWithStats.usecase";
import type { SubjectCardDTO } from "../dto/subjectCardDto";
import type { SubjectQueryRepository } from "../repositories/repositories.interfaces";

export class getSubjectQueryStatsUsecase {
	constructor(private readonly subjectQueryRepository: SubjectQueryRepository) {}

	async execute(
		params: GetSubjectsWithStatsInput = {},
	): Promise<SubjectCardDTO[]> {
		return this.subjectQueryRepository.getSubjectCards(params);
	}
}

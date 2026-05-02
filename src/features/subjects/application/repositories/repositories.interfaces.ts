import type { SubjectCardDTO } from "../dto/subjectCardDto";

export type GetSubjectCardsParams = {
	limit?: number;
};

export interface SubjectQueryRepository {
	getSubjectCards(params?: GetSubjectCardsParams): Promise<SubjectCardDTO[]>;
}

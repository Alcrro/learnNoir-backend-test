import type { SubjectCardDTO } from "../../application/dto/subjectCardDto";

export type SubjectCardStatsRow = SubjectCardDTO;

export class SubjectQueryMapper {
	static toDomain(subject: SubjectCardStatsRow): SubjectCardDTO {
		return subject;
	}
}

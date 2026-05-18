import type { SubjectCardDTO } from "../../../subjects/application/dto/subjectCardDto";

export type SubjectCardStatsRow = {
	id: string;
	title: string;
	slug?: string;
	description?: string;
	modules_count: number;
	lessons_count: number;
	total_hours: number;
};

export class SubjectQueryMapper {
	static toDomain(row: SubjectCardStatsRow): SubjectCardDTO {
		return {
			id: row.id,
			title: row.title,
			slug: row.slug ?? "",
			description: row.description ?? "",
			modulesCount: row.modules_count,
			lessonsCount: row.lessons_count,
			totalHours: row.total_hours,
		};
	}
}

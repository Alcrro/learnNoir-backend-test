import type { SupabaseClient } from "@supabase/supabase-js";
import type { Tables } from "../../../../database.types";
import type { SubjectCardDTO } from "../../application/dto/subjectCardDto";
import type {
	GetSubjectCardsParams,
	SubjectQueryRepository,
} from "../../application/repositories/subjects.interfaces";
import type { Database } from "../../../../database.types";
import { SubjectQueryMapper } from "../mapper/SubjectQueryMapper.mapper";
import { DatabaseError } from "../../../../utils/errors/DatabaseError";

type SubjectRow = Pick<Tables<"subjects">, "id" | "name" | "slug" | "description">;
type CategoryRow = Pick<Tables<"categories">, "id" | "subject_id">;
type ModuleRow = Pick<Tables<"modules">, "id" | "category_id">;
type LessonRow = Pick<Tables<"lessons">, "module_id" | "duration_seconds">;

export class SubjectQueryRepositoryImpl implements SubjectQueryRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}

	async getSubjectCards(
		params: GetSubjectCardsParams = {},
	): Promise<SubjectCardDTO[]> {
		const { data: subjects, error: subjectsError } = await this.db
			.from("subjects")
			.select("id, name, slug, description")
			.order("order", { ascending: true })
			.limit(params.limit ?? 30);

		if (subjectsError) throw new DatabaseError(subjectsError.message);
		if (!subjects || subjects.length === 0) return [];

		const subjectIds = subjects.map((subject) => subject.id);
		const { data: categories, error: categoriesError } = await this.db
			.from("categories")
			.select("id, subject_id")
			.in("subject_id", subjectIds);

		if (categoriesError) throw new DatabaseError(categoriesError.message);

		const categoryRows = (categories ?? []) as CategoryRow[];
		const categoryToSubjectId = new Map(
			categoryRows.map((category) => [category.id, category.subject_id]),
		);
		const categoryIds = categoryRows.map((category) => category.id);

		const modules =
			categoryIds.length > 0
				? await this.getModulesByCategoryIds(categoryIds)
				: [];

		const moduleToSubjectId = new Map<string, string>();
		const modulesCountBySubjectId = new Map<string, number>();

		for (const module of modules) {
			if (!module.category_id) continue;
			const subjectId = categoryToSubjectId.get(module.category_id);
			if (!subjectId) continue;

			moduleToSubjectId.set(module.id, subjectId);
			modulesCountBySubjectId.set(
				subjectId,
				(modulesCountBySubjectId.get(subjectId) ?? 0) + 1,
			);
		}

		const lessons =
			modules.length > 0
				? await this.getLessonsByModuleIds(modules.map((module) => module.id))
				: [];

		const lessonsCountBySubjectId = new Map<string, number>();
		const totalSecondsBySubjectId = new Map<string, number>();

		for (const lesson of lessons) {
			const subjectId = moduleToSubjectId.get(lesson.module_id);
			if (!subjectId) continue;

			lessonsCountBySubjectId.set(
				subjectId,
				(lessonsCountBySubjectId.get(subjectId) ?? 0) + 1,
			);
			totalSecondsBySubjectId.set(
				subjectId,
				(totalSecondsBySubjectId.get(subjectId) ?? 0) + lesson.duration_seconds,
			);
		}

		return (subjects as SubjectRow[]).map((subject) =>
			SubjectQueryMapper.toDomain({
				id: subject.id,
				slug: subject.slug,
				title: subject.name,
				description: subject.description ?? "",
				modulesCount: modulesCountBySubjectId.get(subject.id) ?? 0,
				lessonsCount: lessonsCountBySubjectId.get(subject.id) ?? 0,
				totalHours: Number(
					((totalSecondsBySubjectId.get(subject.id) ?? 0) / 3600).toFixed(2),
				),
			}),
		);
	}

	private async getModulesByCategoryIds(
		categoryIds: string[],
	): Promise<ModuleRow[]> {
		const { data, error } = await this.db
			.from("modules")
			.select("id, category_id")
			.in("category_id", categoryIds);

		if (error) throw new DatabaseError(error.message);

		return (data ?? []) as ModuleRow[];
	}

	private async getLessonsByModuleIds(
		moduleIds: string[],
	): Promise<LessonRow[]> {
		const { data, error } = await this.db
			.from("lessons")
			.select("module_id, duration_seconds")
			.in("module_id", moduleIds);

		if (error) throw new DatabaseError(error.message);

		return (data ?? []) as LessonRow[];
	}
}

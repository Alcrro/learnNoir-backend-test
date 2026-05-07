import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoriesQueryRepository } from "../../application/repositories/CategoriesRepository.interfaces";
import type { Database } from "../../../../database.types";
import { DatabaseError } from "../../../../utils/errors/DatabaseError";
import { SubjectQueryMapper } from "../mapper/SubjectQueryMapper.mapper";
import type { CategoryQueryDTOOutput } from "../../application/dto/CategoryQueryDTO";
import type { CategoryWithModulesDTOOutput } from "../../application/dto/CategoryWithModulesDTO";

export class CategoriesQueryRepoImpl implements CategoriesQueryRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}

	async getCategoriesStats(): Promise<CategoryQueryDTOOutput> {
		const { data, error } = await this.db.rpc("get_subject_cards");

		if (error) throw new DatabaseError(error.message);

		return data.map(SubjectQueryMapper.toDomain);
	}

	async getCategoriesWithModules(subjectSlug: string): Promise<CategoryWithModulesDTOOutput> {
		const { data: subject, error: subErr } = await this.db
			.from("subjects")
			.select("id")
			.eq("slug", subjectSlug)
			.single();

		if (subErr || !subject) throw new DatabaseError(subErr?.message ?? "Subject not found");

		const { data: cats, error: catErr } = await this.db
			.from("categories")
			.select("id, name, slug, position")
			.eq("subject_id", subject.id)
			.order("position");

		if (catErr) throw new DatabaseError(catErr.message);
		if (!cats?.length) return [];

		const categoryIds = cats.map((c) => c.id);

		const { data: mods, error: modErr } = await this.db
			.from("modules")
			.select("id, name, slug, position, category_id")
			.in("category_id", categoryIds)
			.order("position");

		if (modErr) throw new DatabaseError(modErr.message);

		const moduleIds = (mods ?? []).map((m) => m.id);

		const { data: lessonRows, error: lessonErr } = moduleIds.length
			? await this.db
					.from("lessons")
					.select("id, module_id, duration_seconds")
					.in("module_id", moduleIds)
			: { data: [] as { id: string; module_id: string; duration_seconds: number }[], error: null };

		if (lessonErr) throw new DatabaseError(lessonErr.message);

		const lessonsByModule = new Map<string, { id: string; duration_seconds: number }[]>();
		for (const lesson of lessonRows ?? []) {
			const bucket = lessonsByModule.get(lesson.module_id) ?? [];
			bucket.push(lesson);
			lessonsByModule.set(lesson.module_id, bucket);
		}

		return cats.map((cat) => {
			const catMods = (mods ?? []).filter((m) => m.category_id === cat.id);
			const modules = catMods.map((m) => {
				const mLessons = lessonsByModule.get(m.id) ?? [];
				const totalSecs = mLessons.reduce((sum, l) => sum + l.duration_seconds, 0);
				return {
					id: m.id,
					name: m.name,
					slug: m.slug,
					position: m.position ?? 0,
					lessonCount: mLessons.length,
					estimatedHours: Math.round(totalSecs / 360) / 10,
				};
			});

			return {
				id: cat.id,
				name: cat.name,
				slug: cat.slug,
				position: cat.position,
				modules,
				totalLessons: modules.reduce((sum, m) => sum + m.lessonCount, 0),
			};
		});
	}
}

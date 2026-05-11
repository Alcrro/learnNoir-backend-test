import type { SupabaseClient } from "@supabase/supabase-js";
import type { LessonEntity } from "../../domain/entities/Lesson";
import type { ILessonRepository, LessonEditChange, LessonEditEntry } from "../../domain/repositories/LeasonRepository";
import { LessonMapper } from "../mapper/lesson.mapper";
import {
	DatabaseError,
	NotFoundError,
} from "../../../../utils/errors/DatabaseError";
import type { Database } from "../../../../database.types";
import type { LessonAuthor } from "../../domain/types/Lesson.type";
import type {
	TeacherLessonDTO,
	TeacherStatsDTO,
	TeacherStudentDTO,
} from "../../application/dto/TeacherLessons.dto";

type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];
type LessonAuthorRow = Database["public"]["Tables"]["lesson_authors"]["Row"];

type ProgressRow = {
	lesson_id: string;
	user_id: string;
	status: string;
	weighted_score: number;
};

function buildProgressStatsMap(rows: ProgressRow[]) {
	const map = new Map<
		string,
		{ studentIds: Set<string>; completed: number; total: number; totalScore: number }
	>();
	for (const row of rows) {
		const entry = map.get(row.lesson_id) ?? {
			studentIds: new Set<string>(),
			completed: 0,
			total: 0,
			totalScore: 0,
		};
		entry.studentIds.add(row.user_id);
		entry.total++;
		if (row.status === "completed") entry.completed++;
		entry.totalScore += row.weighted_score ?? 0;
		map.set(row.lesson_id, entry);
	}
	return map;
}

export class LessonRepositoryImpl implements ILessonRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}

	async list(): Promise<LessonEntity[]> {
		const { data, error } = await this.db
			.from("lessons")
			.select("*")
			.order("position", { ascending: true });

		if (error) {
			throw new DatabaseError(error.message);
		}

		return this.mapRowsWithAuthors(data ?? []);
	}

	async listByModuleId(moduleId: string): Promise<LessonEntity[]> {
		const { data, error } = await this.db
			.from("lessons")
			.select("*")
			.eq("module_id", moduleId)
			.order("position", { ascending: true });

		if (error) {
			throw new DatabaseError(error.message);
		}

		return this.mapRowsWithAuthors(data ?? []);
	}

	async listByModuleSlug(slug: string): Promise<LessonEntity[]> {
		const { data: moduleRow, error: moduleError } = await this.db
			.from("modules")
			.select("id")
			.eq("slug", slug)
			.maybeSingle();

		if (moduleError) {
			throw new DatabaseError(moduleError.message);
		}

		if (!moduleRow) {
			return [];
		}

		return this.listByModuleId(moduleRow.id);
	}
	// Looks up a lesson by its URL slug. Returns null when not found.
	async getBySlug(slug: string): Promise<LessonEntity | null> {
		const { data, error } = await this.db
			.from("lessons")
			.select("*")
			.eq("slug", slug)
			.maybeSingle();

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!data) return null;

		const authorsByLessonId = await this.getAuthorsByLessonIds([data.id]);
		return LessonMapper.toDomain(data, authorsByLessonId.get(data.id) ?? []);
	}

	async get(id: string): Promise<LessonEntity> {
		const { data, error } = await this.db
			.from("lessons")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!data) {
			throw new NotFoundError("Lesson not found");
		}

		const authorsByLessonId = await this.getAuthorsByLessonIds([data.id]);

		return LessonMapper.toDomain(data, authorsByLessonId.get(data.id) ?? []);
	}
	async create(lesson: LessonEntity, authorId: string): Promise<LessonEntity> {
		const payload = LessonMapper.toPersistance(lesson);
		const { data, error } = await this.db
			.from("lessons")
			.insert(payload)
			.select()
			.single();

		if (error) throw new DatabaseError(error.message);
		if (!data) throw new DatabaseError("Lesson not found");

		const { error: authorError } = await this.db.from("lesson_authors").insert({
			lesson_id: data.id,
			user_id: authorId,
			role: "author",
		});

		if (authorError) {
			await this.db.from("lessons").delete().eq("id", data.id);
			throw new DatabaseError(authorError.message);
		}

		return this.get(data.id);
	}

	async update(id: string, lesson: LessonEntity): Promise<void> {
		const payload = LessonMapper.toPersistance(lesson);
		const { error, count } = await this.db
			.from("lessons")
			.update({
				...payload,
				updated_at: new Date().toISOString(),
			}, { count: "exact" })
			.eq("id", id);

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!count) {
			throw new NotFoundError("Lesson not found");
		}
	}
	async delete(id: string): Promise<void> {
		const { error, count } = await this.db
			.from("lessons")
			.delete({ count: "exact" })
			.eq("id", id);

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!count) {
			throw new NotFoundError("Lesson not found");
		}
	}

	async review(id: string): Promise<void> {
		const { error, count } = await this.db
			.from("lessons")
			.update({
				status: "reviewed",
				updated_at: new Date().toISOString(),
			}, { count: "exact" })
			.eq("id", id);

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!count) {
			throw new NotFoundError("Lesson not found");
		}
	}

	async publish(id: string): Promise<void> {
		const lesson = await this.get(id);
		lesson.publish();

		const { error, count } = await this.db
			.from("lessons")
			.update({
				status: lesson.getStatus(),
				updated_at: lesson.updatedAt.toISOString(),
			}, { count: "exact" })
			.eq("id", id);

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!count) {
			throw new NotFoundError("Lesson not found");
		}
	}

	async listByTeacher(teacherId: string): Promise<TeacherLessonDTO[]> {
		const lessonIds = await this.getTeacherLessonIds(teacherId);
		if (lessonIds.length === 0) return [];

		const { data: lessonsData, error: lessonsError } = await this.db
			.from("lessons")
			.select("id, title, slug, description, duration_seconds, position, is_active, status, module_id, created_at, updated_at")
			.in("id", lessonIds)
			.order("updated_at", { ascending: false });

		if (lessonsError) throw new DatabaseError(lessonsError.message);

		const moduleIds = [...new Set((lessonsData ?? []).map((l) => l.module_id))];
		const moduleMap = await this.getModuleNameMap(moduleIds);

		const { data: progressData, error: progressError } = await this.db
			.from("user_lesson_progress")
			.select("lesson_id, user_id, status, weighted_score")
			.in("lesson_id", lessonIds);

		if (progressError) throw new DatabaseError(progressError.message);

		const statsMap = buildProgressStatsMap(progressData ?? []);

		return (lessonsData ?? []).map((lesson) => {
			const stats = statsMap.get(lesson.id);
			return {
				id: lesson.id,
				title: lesson.title,
				slug: lesson.slug,
				description: lesson.description ?? null,
				durationSeconds: lesson.duration_seconds,
				position: lesson.position ?? null,
				isActive: lesson.is_active ?? true,
				status: (lesson.status ?? "draft") as TeacherLessonDTO["status"],
				moduleId: lesson.module_id,
				moduleName: moduleMap.get(lesson.module_id) ?? "Unknown",
				createdAt: lesson.created_at ?? "",
				updatedAt: lesson.updated_at ?? "",
				studentCount: stats?.studentIds.size ?? 0,
				completionRate:
					stats && stats.total > 0
						? Math.round((stats.completed / stats.total) * 100)
						: 0,
				avgScore:
					stats && stats.studentIds.size > 0
						? Math.round(stats.totalScore / stats.studentIds.size)
						: 0,
			};
		});
	}

	async getTeacherStats(teacherId: string): Promise<TeacherStatsDTO> {
		const lessons = await this.listByTeacher(teacherId);
		const lessonIds = lessons.map((l) => l.id);

		const totalStudents = await this.countUniqueStudents(lessonIds);
		const totalLessons = lessons.length;
		const avgCompletionRate =
			totalLessons > 0
				? Math.round(
						lessons.reduce((sum, l) => sum + l.completionRate, 0) / totalLessons,
					)
				: 0;

		const liveLesson = await this.findMostRecentlyActiveLessson(lessonIds, lessons);

		return {
			totalLessons,
			publishedLessons: lessons.filter((l) => l.status === "published").length,
			draftLessons: lessons.filter((l) => l.status === "draft").length,
			reviewedLessons: lessons.filter((l) => l.status === "reviewed").length,
			totalStudents,
			avgCompletionRate,
			liveLesson,
		};
	}

	async getTeacherStudents(teacherId: string): Promise<TeacherStudentDTO[]> {
		const lessonIds = await this.getTeacherLessonIds(teacherId);
		if (lessonIds.length === 0) return [];

		const { data: progressData, error: progressError } = await this.db
			.from("user_lesson_progress")
			.select("user_id, lesson_id, status, weighted_score, last_activity_at")
			.in("lesson_id", lessonIds);

		if (progressError) throw new DatabaseError(progressError.message);
		if (!progressData || progressData.length === 0) return [];

		const userIds = [...new Set(progressData.map((p) => p.user_id))];

		const { data: profilesData, error: profilesError } = await this.db
			.from("profiles")
			.select("id, username, avatar_url")
			.in("id", userIds);

		if (profilesError) throw new DatabaseError(profilesError.message);

		const byUser = new Map<
			string,
			{ completed: number; inProgress: number; total: number; totalScore: number; lastActivity: string | null }
		>();

		for (const row of progressData) {
			const entry = byUser.get(row.user_id) ?? {
				completed: 0,
				inProgress: 0,
				total: 0,
				totalScore: 0,
				lastActivity: null,
			};
			entry.total++;
			if (row.status === "completed") entry.completed++;
			else if (row.status === "in_progress") entry.inProgress++;
			entry.totalScore += row.weighted_score ?? 0;
			if (row.last_activity_at && (!entry.lastActivity || row.last_activity_at > entry.lastActivity)) {
				entry.lastActivity = row.last_activity_at;
			}
			byUser.set(row.user_id, entry);
		}

		return (profilesData ?? [])
			.map((profile) => {
				const stats = byUser.get(profile.id) ?? {
					completed: 0,
					inProgress: 0,
					total: 0,
					totalScore: 0,
					lastActivity: null,
				};
				return {
					userId: profile.id,
					username: profile.username ?? "Unknown",
					avatarUrl: profile.avatar_url ?? null,
					lessonsTotal: stats.total,
					lessonsCompleted: stats.completed,
					lessonsInProgress: stats.inProgress,
					avgScore: stats.total > 0 ? Math.round(stats.totalScore / stats.total) : 0,
					lastActivityAt: stats.lastActivity,
				};
			})
			.sort((a, b) => b.avgScore - a.avgScore);
	}

	private async getTeacherLessonIds(teacherId: string): Promise<string[]> {
		const { data, error } = await this.db
			.from("lesson_authors")
			.select("lesson_id")
			.eq("user_id", teacherId);
		if (error) throw new DatabaseError(error.message);
		return (data ?? []).map((r) => r.lesson_id);
	}

	private async getModuleNameMap(moduleIds: string[]): Promise<Map<string, string>> {
		if (moduleIds.length === 0) return new Map();
		const { data, error } = await this.db
			.from("modules")
			.select("id, name")
			.in("id", moduleIds);
		if (error) throw new DatabaseError(error.message);
		return new Map((data ?? []).map((m) => [m.id, m.name]));
	}

	private async countUniqueStudents(lessonIds: string[]): Promise<number> {
		if (lessonIds.length === 0) return 0;
		const { data, error } = await this.db
			.from("user_lesson_progress")
			.select("user_id")
			.in("lesson_id", lessonIds);
		if (error) throw new DatabaseError(error.message);
		return new Set((data ?? []).map((r) => r.user_id)).size;
	}

	private async findMostRecentlyActiveLessson(
		lessonIds: string[],
		lessons: TeacherLessonDTO[],
	): Promise<TeacherStatsDTO["liveLesson"]> {
		if (lessonIds.length === 0) return null;
		const { data, error } = await this.db
			.from("user_lesson_progress")
			.select("lesson_id, last_activity_at")
			.in("lesson_id", lessonIds)
			.not("last_activity_at", "is", null)
			.order("last_activity_at", { ascending: false })
			.limit(1);

		if (error || !data || data.length === 0) return null;
		const row = data[0];
		if (!row) return null;
		const lesson = lessons.find((l) => l.id === row.lesson_id);
		if (!lesson) return null;
		return { id: lesson.id, title: lesson.title, lastActivityAt: row.last_activity_at ?? "" };
	}

	private async mapRowsWithAuthors(rows: LessonRow[]): Promise<LessonEntity[]> {
		const authorsByLessonId = await this.getAuthorsByLessonIds(
			rows.map((row) => row.id),
		);

		return rows.map((row) =>
			LessonMapper.toDomain(row, authorsByLessonId.get(row.id) ?? []),
		);
	}

	private async getAuthorsByLessonIds(lessonIds: string[]) {
		const authorsByLessonId = new Map<string, LessonAuthor[]>();

		if (lessonIds.length === 0) {
			return authorsByLessonId;
		}

		const { data, error } = await this.db
			.from("lesson_authors")
			.select("lesson_id, user_id, role")
			.in("lesson_id", lessonIds);

		if (error) {
			throw new DatabaseError(error.message);
		}

		for (const row of (data ?? []) as Pick<
			LessonAuthorRow,
			"lesson_id" | "user_id" | "role"
		>[]) {
			const currentAuthors = authorsByLessonId.get(row.lesson_id) ?? [];

			currentAuthors.push({
				userId: row.user_id,
				role: row.role,
			});
			authorsByLessonId.set(row.lesson_id, currentAuthors);
		}

		return authorsByLessonId;
	}

	async logEdit(lessonId: string, editorId: string, changes: LessonEditChange[]): Promise<void> {
		const { error } = await this.db.from("lesson_edit_history").insert({
			lesson_id: lessonId,
			editor_id: editorId,
			changes: JSON.parse(JSON.stringify(changes)) as import("../../../../database.types").Json,
		});
		if (error) throw new DatabaseError(error.message);
	}

	async getHistory(lessonId: string): Promise<LessonEditEntry[]> {
		const { data, error } = await this.db
			.from("lesson_edit_history")
			.select("id, lesson_id, editor_id, changed_at, changes")
			.eq("lesson_id", lessonId)
			.order("changed_at", { ascending: false })
			.limit(50);

		if (error) throw new DatabaseError(error.message);
		if (!data || data.length === 0) return [];

		const editorIds = [...new Set(data.map((r) => r.editor_id))];
		const { data: profiles } = await this.db
			.from("profiles")
			.select("id, username")
			.in("id", editorIds);

		const nameMap = new Map(
			(profiles ?? []).map((p) => [p.id, p.username ?? "Unknown"]),
		);

		return data.map((row) => ({
			id: row.id,
			lessonId: row.lesson_id,
			editorId: row.editor_id,
			editorName: nameMap.get(row.editor_id) ?? "Unknown",
			changedAt: row.changed_at,
			changes: row.changes as unknown as LessonEditChange[],
		}));
	}
}

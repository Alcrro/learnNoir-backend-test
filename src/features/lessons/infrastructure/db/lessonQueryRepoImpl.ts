import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../../../database.types";
import { DatabaseError } from "../../../../utils/errors/DatabaseError";
import type { ILessonQueryRepository } from "../../application/repositories/ILessonQueryRepository.ts";
import type { LessonEditChange, LessonEditEntry } from "../../domain/repositories/LessonRepository.ts";
import type {
	TeacherLessonDTO,
	TeacherStatsDTO,
	TeacherStudentDTO,
} from "../../application/dto/TeacherLessons.dto";

type ProgressRow = {
	lesson_id: string;
	user_id: string;
	status: string;
	weighted_score: number;
	last_activity_at?: string | null;
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

export class LessonQueryRepositoryImpl implements ILessonQueryRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}

	async listByTeacher(teacherId: string): Promise<TeacherLessonDTO[]> {
		const { lessons } = await this.fetchTeacherLessonsWithProgress(teacherId);
		return lessons;
	}

	async getTeacherStats(teacherId: string): Promise<TeacherStatsDTO> {
		const { lessons, progressRows } = await this.fetchTeacherLessonsWithProgress(teacherId);

		const totalLessons = lessons.length;
		const totalStudents = new Set(progressRows.map((r) => r.user_id)).size;
		const avgCompletionRate =
			totalLessons > 0
				? Math.round(lessons.reduce((sum, l) => sum + l.completionRate, 0) / totalLessons)
				: 0;
		const liveLesson = this.deriveMostRecentlyActiveLesson(progressRows, lessons);

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

	private async fetchTeacherLessonsWithProgress(teacherId: string): Promise<{
		lessons: TeacherLessonDTO[];
		progressRows: ProgressRow[];
	}> {
		const lessonIds = await this.getTeacherLessonIds(teacherId);
		if (lessonIds.length === 0) return { lessons: [], progressRows: [] };

		const [lessonsResult, progressResult] = await Promise.all([
			this.db
				.from("lessons")
				.select("id, title, slug, description, duration_seconds, position, is_active, status, module_id, created_at, updated_at")
				.in("id", lessonIds)
				.order("updated_at", { ascending: false }),
			this.db
				.from("user_lesson_progress")
				.select("lesson_id, user_id, status, weighted_score, last_activity_at")
				.in("lesson_id", lessonIds),
		]);

		if (lessonsResult.error) throw new DatabaseError(lessonsResult.error.message);
		if (progressResult.error) throw new DatabaseError(progressResult.error.message);

		const lessonsData = lessonsResult.data ?? [];
		const progressRows = progressResult.data ?? [];

		const moduleIds = [...new Set(lessonsData.map((l) => l.module_id))];
		const moduleMap = await this.getModuleNameMap(moduleIds);

		const statsMap = buildProgressStatsMap(progressRows);

		const lessons: TeacherLessonDTO[] = lessonsData.map((lesson) => {
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

		return { lessons, progressRows };
	}

	private deriveMostRecentlyActiveLesson(
		progressRows: ProgressRow[],
		lessons: TeacherLessonDTO[],
	): TeacherStatsDTO["liveLesson"] {
		const best = progressRows.reduce<ProgressRow | null>((acc, row) => {
			if (!row.last_activity_at) return acc;
			if (!acc?.last_activity_at || row.last_activity_at > acc.last_activity_at) return row;
			return acc;
		}, null);

		if (!best) return null;
		const lesson = lessons.find((l) => l.id === best.lesson_id);
		if (!lesson) return null;
		return { id: lesson.id, title: lesson.title, lastActivityAt: best.last_activity_at! };
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
}

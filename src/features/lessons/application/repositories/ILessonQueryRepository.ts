import type { LessonEditEntry } from "../../domain/repositories/LessonRepository.ts";
import type {
	TeacherLessonDTO,
	TeacherStatsDTO,
	TeacherStudentDTO,
} from "../dto/TeacherLessons.dto.ts";

export interface ILessonQueryRepository {
	listByTeacher(teacherId: string): Promise<TeacherLessonDTO[]>;
	getTeacherStats(teacherId: string): Promise<TeacherStatsDTO>;
	getTeacherStudents(teacherId: string): Promise<TeacherStudentDTO[]>;
	getHistory(lessonId: string): Promise<LessonEditEntry[]>;
}

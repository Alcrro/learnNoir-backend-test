import type { LessonEntity } from "../entities/Lesson";
import type {
	TeacherLessonDTO,
	TeacherStatsDTO,
	TeacherStudentDTO,
} from "../../application/dto/TeacherLessons.dto";

export interface ILessonRepository {
	get(id: string): Promise<LessonEntity>;
	getBySlug(slug: string): Promise<LessonEntity | null>;
	create(lesson: LessonEntity, authorId: string): Promise<LessonEntity>;
	update(id: string, lesson: LessonEntity): Promise<void>;
	delete(id: string): Promise<void>;
	review(id: string): Promise<void>;
	publish(id: string): Promise<void>;

	list(): Promise<LessonEntity[]>;
	listByModuleId(moduleId: string): Promise<LessonEntity[]>;
	listByModuleSlug(slug: string): Promise<LessonEntity[]>;

	listByTeacher(teacherId: string): Promise<TeacherLessonDTO[]>;
	getTeacherStats(teacherId: string): Promise<TeacherStatsDTO>;
	getTeacherStudents(teacherId: string): Promise<TeacherStudentDTO[]>;
}

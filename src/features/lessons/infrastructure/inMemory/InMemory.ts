import { algorithmDocMapper } from "../../../../data/programming/algorithms";
import type { Lesson } from "../../domain/entities/Lesson";
import type { ILessonRepository } from "../../domain/repositories/LessonRepository";
import type {
	TeacherLessonDTO,
	TeacherStatsDTO,
	TeacherStudentDTO,
} from "../../application/dto/TeacherLessons.dto";

export class InMemoryImpl implements ILessonRepository {
	list(): Promise<Lesson[]> {
		void algorithmDocMapper;
		throw new Error("Method not implemented.");
	}
	listByModuleId(_moduleId: string): Promise<Lesson[]> {
		throw new Error("Method not implemented.");
	}
	listByModuleSlug(_slug: string): Promise<Lesson[]> {
		throw new Error("Method not implemented.");
	}
	async get(_id: string): Promise<Lesson> {
		throw new Error("Method not implemented.");
	}
	async getBySlug(_slug: string): Promise<Lesson | null> {
		throw new Error("Method not implemented.");
	}
	async listByTeacher(_teacherId: string): Promise<TeacherLessonDTO[]> {
		throw new Error("Method not implemented.");
	}
	async getTeacherStats(_teacherId: string): Promise<TeacherStatsDTO> {
		throw new Error("Method not implemented.");
	}
	async getTeacherStudents(_teacherId: string): Promise<TeacherStudentDTO[]> {
		throw new Error("Method not implemented.");
	}
	create(_lesson: Lesson, _authorId: string): Promise<Lesson> {
		throw new Error("Method not implemented.");
	}
	update(_id: string, _lesson: Lesson): Promise<void> {
		throw new Error("Method not implemented.");
	}
	delete(_id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	review(_id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	publish(_id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	logEdit(_lessonId: string, _editorId: string, _changes: import("../../domain/repositories/LessonRepository").LessonEditChange[]): Promise<void> {
		return Promise.resolve();
	}
	getHistory(_lessonId: string): Promise<import("../../domain/repositories/LessonRepository").LessonEditEntry[]> {
		return Promise.resolve([]);
	}
}

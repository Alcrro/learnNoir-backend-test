import type { LessonEntity } from "../entities/Lesson";

export type LessonEditChange = { field: string; from: string; to: string };

export type LessonEditEntry = {
	id: string;
	lessonId: string;
	editorId: string;
	editorName: string;
	changedAt: string;
	changes: LessonEditChange[];
};

export interface ILessonRepository {
	get(id: string): Promise<LessonEntity>;
	getBySlug(slug: string): Promise<LessonEntity | null>;
	create(lesson: LessonEntity, authorId: string): Promise<LessonEntity>;
	update(id: string, lesson: LessonEntity): Promise<void>;
	delete(id: string): Promise<void>;
	review(id: string): Promise<void>;
	publish(id: string): Promise<void>;

	list(): Promise<LessonEntity[]>;
	listByModuleId(moduleId: string, language?: string | null): Promise<LessonEntity[]>;
	listByModuleSlug(slug: string, language?: string | null): Promise<LessonEntity[]>;

	logEdit(lessonId: string, editorId: string, changes: LessonEditChange[]): Promise<void>;
}

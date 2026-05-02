import type { LessonEntity } from "../entities/Lesson";

export interface ILessonRepository {
	get(id: string): Promise<LessonEntity>;
	create(lesson: LessonEntity, authorId: string): Promise<LessonEntity>;
	update(id: string, lesson: LessonEntity): Promise<void>;
	delete(id: string): Promise<void>;
	review(id: string): Promise<void>;
	publish(id: string): Promise<void>;

	list(): Promise<LessonEntity[]>;
	listByModuleId(moduleId: string): Promise<LessonEntity[]>;
	listByModuleSlug(slug: string): Promise<LessonEntity[]>;
}

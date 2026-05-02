import type { LessonBlockEntity } from "../entities/LessonBlockEntity";

export interface LessonBlockRepository {
	findById(id: string): Promise<LessonBlockEntity | null>;
	findByLessonId(lessonId: string): Promise<LessonBlockEntity[]>;
	create(block: LessonBlockEntity): Promise<LessonBlockEntity>;
	update(id: string, block: LessonBlockEntity): Promise<void>;
	delete(id: string): Promise<void>;
	reorder(lessonId: string, blockId: string, newPosition: number): Promise<void>;
}

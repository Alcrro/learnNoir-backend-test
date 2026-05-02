import type { ILesson } from "../../domain/types/Lesson.type";

export type LessonDTO = ILesson;

export type CreateLessonDTO = {
	moduleId: string;
	title: string;
	slug?: string;
	description?: string | null;
	durationSeconds?: number;
	position?: number | null;
	isActive?: boolean;
};

export type UpdateLessonDTO = Partial<CreateLessonDTO>;

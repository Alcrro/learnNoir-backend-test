export type LessonVersion = {
	id: string;
	lessonId: string;
	title: string;
	version: number;
	description: string | null;
	difficultyLevel: number | null;
	estimatedDurationMinutes: number | null;
	gradeLevelId: string | null;
	conceptId: string | null;
	pedagogyStyle: string | null;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
};

export type CreateLessonVersionDTO = {
	title: string;
	description?: string | null;
	difficultyLevel?: number | null;
	estimatedDurationMinutes?: number | null;
	gradeLevelId?: string | null;
	conceptId?: string | null;
	pedagogyStyle?: string | null;
};

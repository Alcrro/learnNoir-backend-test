export type VideoSegment = {
	text: string;
	start_ms: number;
	end_ms: number;
};

export type LessonVideo = {
	id: string;
	lessonId: string;
	script: VideoSegment[];
	videoUrl: string;
	provider: string | null;
	generatedAt: string;
};

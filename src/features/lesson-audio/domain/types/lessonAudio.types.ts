export type AudioSegment = {
	text: string;
	start_ms: number;
	end_ms: number;
};

export type LessonAudio = {
	id: string;
	lessonId: string;
	script: AudioSegment[];
	audioUrl: string;
	generatedAt: string;
};

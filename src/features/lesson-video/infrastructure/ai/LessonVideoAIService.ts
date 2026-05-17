import type { VideoSegment } from "../../domain/types/lessonVideo.types.ts";

export interface ILessonVideoProvider {
	generateVideo(script: VideoSegment[], lessonId: string): Promise<string>;
}

// Placeholder — înlocuiește cu HeyGen / D-ID / Synthesia când ai API key-ul
export class StubVideoProvider implements ILessonVideoProvider {
	async generateVideo(_script: VideoSegment[], _lessonId: string): Promise<string> {
		throw new Error("Video provider not configured. Implement ILessonVideoProvider with HeyGen, D-ID, or Synthesia.");
	}
}

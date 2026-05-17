import type { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseError } from "../../../../utils/errors/DatabaseError.ts";
import type { LessonVideoRepository } from "../../domain/repositories/LessonVideoRepository.ts";
import type { LessonVideo, VideoSegment } from "../../domain/types/lessonVideo.types.ts";

type LessonVideoRow = {
	id: string;
	lesson_id: string;
	script: VideoSegment[];
	video_url: string;
	provider: string | null;
	generated_at: string | null;
};

function toEntity(row: LessonVideoRow): LessonVideo {
	return {
		id: row.id,
		lessonId: row.lesson_id,
		script: row.script,
		videoUrl: row.video_url,
		provider: row.provider,
		generatedAt: row.generated_at ?? new Date().toISOString(),
	};
}

export class LessonVideoRepoImpl implements LessonVideoRepository {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(private readonly db: SupabaseClient<any>) {}

	async findByLessonId(lessonId: string): Promise<LessonVideo | null> {
		const { data, error } = await this.db
			.from("lesson_video")
			.select("*")
			.eq("lesson_id", lessonId)
			.maybeSingle();

		if (error) throw new DatabaseError(error.message);
		return data ? toEntity(data as LessonVideoRow) : null;
	}

	async upsert(video: Omit<LessonVideo, "id" | "generatedAt">): Promise<LessonVideo> {
		const { data, error } = await this.db
			.from("lesson_video")
			.upsert(
				{
					lesson_id: video.lessonId,
					script: video.script,
					video_url: video.videoUrl,
					provider: video.provider,
				},
				{ onConflict: "lesson_id" },
			)
			.select("*")
			.single();

		if (error) throw new DatabaseError(error.message);
		return toEntity(data as LessonVideoRow);
	}
}

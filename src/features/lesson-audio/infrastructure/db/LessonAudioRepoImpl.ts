import type { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseError } from "../../../../utils/errors/DatabaseError.ts";
import type { LessonAudioRepository } from "../../domain/repositories/LessonAudioRepository.ts";
import type { LessonAudio, AudioSegment } from "../../domain/types/lessonAudio.types.ts";

type LessonAudioRow = {
	id: string;
	lesson_id: string;
	script: AudioSegment[];
	audio_url: string;
	generated_at: string;
};

function toEntity(row: LessonAudioRow): LessonAudio {
	return {
		id: row.id,
		lessonId: row.lesson_id,
		script: row.script,
		audioUrl: row.audio_url,
		generatedAt: row.generated_at,
	};
}

export class LessonAudioRepoImpl implements LessonAudioRepository {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(private readonly db: SupabaseClient<any>) {}

	async findByLessonId(lessonId: string): Promise<LessonAudio | null> {
		const { data, error } = await this.db
			.from("lesson_audio")
			.select("*")
			.eq("lesson_id", lessonId)
			.maybeSingle();

		if (error) throw new DatabaseError(error.message);
		return data ? toEntity(data as LessonAudioRow) : null;
	}

	async upsert(audio: Omit<LessonAudio, "id" | "generatedAt">): Promise<LessonAudio> {
		const { data, error } = await this.db
			.from("lesson_audio")
			.upsert(
				{
					lesson_id: audio.lessonId,
					script: audio.script,
					audio_url: audio.audioUrl,
				},
				{ onConflict: "lesson_id" },
			)
			.select("*")
			.single();

		if (error) throw new DatabaseError(error.message);
		return toEntity(data as LessonAudioRow);
	}
}

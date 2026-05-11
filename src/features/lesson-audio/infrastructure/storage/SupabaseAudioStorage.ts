import type { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseError } from "../../../../utils/errors/DatabaseError.ts";

const BUCKET = "lesson-audio";

export class SupabaseAudioStorage {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(private readonly db: SupabaseClient<any>) {}

	async upload(lessonId: string, buffer: Buffer): Promise<string> {
		const path = `${lessonId}/narration.mp3`;

		const { error } = await this.db.storage
			.from(BUCKET)
			.upload(path, buffer, {
				contentType: "audio/mpeg",
				upsert: true,
			});

		if (error) throw new DatabaseError(`Audio upload failed: ${error.message}`);

		const { data } = this.db.storage.from(BUCKET).getPublicUrl(path);
		return data.publicUrl;
	}
}
